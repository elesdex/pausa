import AppKit
import Foundation
import WebKit

private final class NavigationWaiter: NSObject, WKNavigationDelegate {
    private var continuation: CheckedContinuation<Void, Error>?

    func waitForNavigation() async throws {
        try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        continuation?.resume()
        continuation = nil
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        continuation?.resume(throwing: error)
        continuation = nil
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        continuation?.resume(throwing: error)
        continuation = nil
    }
}

@main
struct CaptureVideoStills {
    @MainActor
    static func main() async throws {
        let project = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
        let output = project.appendingPathComponent("media/video/source", isDirectory: true)
        try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)

        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .nonPersistent()
        let webView = WKWebView(
            frame: NSRect(x: 0, y: 0, width: 390, height: 844),
            configuration: configuration
        )
        let window = NSWindow(
            contentRect: webView.frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        window.contentView = webView
        window.orderFrontRegardless()

        let waiter = NavigationWaiter()
        webView.navigationDelegate = waiter
        let pageURL = URL(string: "https://pausa-digital.elesdex.chatgpt.site/?video-capture=20260720")!

        func loadHome() async throws {
            webView.load(URLRequest(url: pageURL, cachePolicy: .reloadIgnoringLocalCacheData))
            try await waiter.waitForNavigation()
            try await Task.sleep(for: .seconds(4))
            _ = try await webView.evaluateJavaScript("""
                (() => {
                  const style = document.createElement('style');
                  style.textContent = '* { animation: none !important; transition: none !important; } .screen-enter { opacity: 1 !important; transform: none !important; }';
                  document.head.appendChild(style);
                  const select = document.querySelector('select');
                  if (!select) return false;
                  select.value = 'en';
                  select.dispatchEvent(new Event('change', { bubbles: true }));
                  return true;
                })()
                """)
            try await Task.sleep(for: .seconds(1))
        }

        func clickButton(containing text: String) async throws {
            let encoded = try JSONSerialization.data(withJSONObject: [text])
            let literal = String(decoding: encoded, as: UTF8.self)
            let result = try await webView.evaluateJavaScript("""
                (() => {
                  const text = \(literal)[0];
                  const button = [...document.querySelectorAll('button')]
                    .find((item) => item.textContent?.includes(text));
                  if (!button) return false;
                  button.click();
                  return true;
                })()
                """)
            guard (result as? Bool) == true else {
                throw NSError(domain: "PausaCapture", code: 1, userInfo: [
                    NSLocalizedDescriptionKey: "Could not find button containing: \(text)"
                ])
            }
            try await Task.sleep(for: .seconds(1.5))
        }

        func save(_ name: String) async throws {
            let config = WKSnapshotConfiguration()
            config.rect = NSRect(x: 0, y: 0, width: 390, height: 844)
            let image = try await webView.takeSnapshot(configuration: config)
            guard
                let tiff = image.tiffRepresentation,
                let bitmap = NSBitmapImageRep(data: tiff),
                let png = bitmap.representation(using: .png, properties: [:])
            else {
                throw NSError(domain: "PausaCapture", code: 2, userInfo: [
                    NSLocalizedDescriptionKey: "Could not encode snapshot: \(name)"
                ])
            }
            try png.write(to: output.appendingPathComponent(name))
            print("Saved \(name)")
        }

        try await loadHome()
        try await save("01-home-en.png")

        try await clickButton(containing: "Share a photo or text")
        try await save("02-input-options-en.png")

        try await loadHome()
        try await clickButton(containing: "Try a guided example")
        try await save("03-guided-example-en.png")

        try await clickButton(containing: "See how Pausa checks it")
        try await save("04-result-en.png")

        window.close()
    }
}
