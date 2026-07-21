import AppKit
import AVFoundation
import CoreVideo
import Foundation

struct Scene {
    let title: String
    let kicker: String
    let narration: String
    let imagePath: String?
    let layout: Layout

    enum Layout {
        case phone
        case evidence
        case closing
    }
}

@main
struct BuildVideoDraft {
    static let width = 1920
    static let height = 1080
    static let fps: Int32 = 15

    @MainActor
    static func main() async throws {
        let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
        let outputDirectory = root.appendingPathComponent("media/video/output", isDirectory: true)
        try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

        let scenes = [
            Scene(
                title: "Urgency is the attack.",
                kicker: "A message looks official. It mentions money. It says: act now.",
                narration: "A message looks official. It mentions money. It tells you to act now. In that moment, urgency is the attack.",
                imagePath: "public/demo/bank-alert-es.png",
                layout: .phone
            ),
            Scene(
                title: "First, pause.",
                kicker: "Free, open source help for moments of digital uncertainty.",
                narration: "Pausa is a free, open source help button for moments of digital uncertainty. It does not monitor your messages. You open it when you want help, and the first step is simple: do not respond yet.",
                imagePath: "media/video/source/01-home-en.png",
                layout: .phone
            ),
            Scene(
                title: "Meet people where they are.",
                kicker: "Voice, camera, screenshot, or pasted text.",
                narration: "You can describe what happened by voice, photograph another screen, choose a saved image, or paste the text. You do not need to know how to take a screenshot to get started.",
                imagePath: "media/video/source/02-input-options-en.png",
                layout: .phone
            ),
            Scene(
                title: "A safe demo starts with context.",
                kicker: "The example is synthetic and clearly labeled.",
                narration: "For a repeatable demonstration, Pausa shows a synthetic bank alert before any result. It explains what the person shared and how the app will turn a moment of doubt into one safer next step.",
                imagePath: "media/video/source/03-guided-example-en.png",
                layout: .phone
            ),
            Scene(
                title: "GPT-5.6 returns constrained guidance.",
                kicker: "Signals, uncertainty, and an independently verified next step.",
                narration: "GPT-5.6 reads the text and image and returns a constrained result. It does not claim certainty. Here it notices artificial urgency, financial fear, and a phone number supplied by the message. Pausa does not tell us to call that number. It guides us to leave the message and verify through a channel we already know.",
                imagePath: "media/video/source/04-result-en.png",
                layout: .phone
            ),
            Scene(
                title: "Support without exposing the original.",
                kicker: "Read aloud, share guidance, or reopen Pausa from the home screen.",
                narration: "The guidance can be read aloud with a disclosed synthetic voice and shared with someone you trust without attaching the original private message. Pausa is bilingual, installable on a phone, and keeps emergency help separate from model guidance.",
                imagePath: "media/video/source/04-result-en.png",
                layout: .phone
            ),
            Scene(
                title: "Built end to end with Codex.",
                kicker: "From a voice conversation to a tested, public product.",
                narration: "I am not a traditional software developer. I started by describing the problem and the people I wanted to help. Codex turned that conversation into a plan, built the product, connected the OpenAI APIs, caught unsafe fallback behavior, optimized image latency, created evaluations, tested each iteration, and kept the submission evidence current.",
                imagePath: nil,
                layout: .evidence
            ),
            Scene(
                title: "Evidence, not just a demo.",
                kicker: "Verified again against the public app on July twentieth.",
                narration: "Pausa passed twelve live safety scenarios, including legitimate, ambiguous, threatening, QR payment, and prompt injection messages. The app is Spanish and English, public, and open source under the Apache two point zero license.",
                imagePath: nil,
                layout: .evidence
            ),
            Scene(
                title: "One calmer, safer next step.",
                kicker: "pausa-digital.elesdex.chatgpt.site  •  github.com/elesdex/pausa",
                narration: "Scams use urgency. Pausa gives people time, clarity, and one safer next step.",
                imagePath: nil,
                layout: .closing
            ),
        ]

        let narrationURL = outputDirectory.appendingPathComponent("pausa-demo-narration-en.aiff")
        let silentVideoURL = outputDirectory.appendingPathComponent("pausa-demo-silent.mp4")
        let finalVideoURL = outputDirectory.appendingPathComponent("pausa-demo-draft-en.mp4")
        let srtURL = outputDirectory.appendingPathComponent("pausa-demo-draft-en.srt")
        let proofURL = outputDirectory.appendingPathComponent("pausa-demo-draft-en-proof.png")

        for url in [narrationURL, silentVideoURL, finalVideoURL, srtURL, proofURL] {
            try? FileManager.default.removeItem(at: url)
        }

        try createNarration(scenes: scenes, at: narrationURL)
        let audioAsset = AVURLAsset(url: narrationURL)
        let audioDuration = try await audioAsset.load(.duration).seconds
        let sceneDurations = distribute(total: audioDuration + 1.2, across: scenes)

        try await renderVideo(
            scenes: scenes,
            durations: sceneDurations,
            root: root,
            outputURL: silentVideoURL
        )
        try await combine(video: silentVideoURL, audio: narrationURL, output: finalVideoURL)
        try makeSRT(scenes: scenes, durations: sceneDurations, output: srtURL)
        try createProofFrame(video: finalVideoURL, output: proofURL)

        let finalAsset = AVURLAsset(url: finalVideoURL)
        let finalDuration = try await finalAsset.load(.duration).seconds
        print(String(format: "Created %@ (%.1f seconds)", finalVideoURL.path, finalDuration))
        print("Created \(srtURL.path)")
        print("Created \(proofURL.path)")
    }

    static func createNarration(scenes: [Scene], at output: URL) throws {
        let script = scenes.map(\.narration).joined(separator: " [[slnc 650]] ")
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/say")
        process.arguments = ["-v", "Samantha", "-r", "168", "-o", output.path, script]
        try process.run()
        process.waitUntilExit()
        guard process.terminationStatus == 0 else {
            throw NSError(domain: "PausaVideo", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "The narration could not be generated."
            ])
        }
    }

    static func distribute(total: Double, across scenes: [Scene]) -> [Double] {
        let weights = scenes.map { Double($0.narration.split(separator: " ").count + 5) }
        let sum = weights.reduce(0, +)
        return weights.map { max(5.5, total * $0 / sum) }
    }

    @MainActor
    static func renderVideo(
        scenes: [Scene],
        durations: [Double],
        root: URL,
        outputURL: URL
    ) async throws {
        let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
        let input = AVAssetWriterInput(
            mediaType: .video,
            outputSettings: [
                AVVideoCodecKey: AVVideoCodecType.h264,
                AVVideoWidthKey: width,
                AVVideoHeightKey: height,
                AVVideoCompressionPropertiesKey: [
                    AVVideoAverageBitRateKey: 5_000_000,
                    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                ],
            ]
        )
        input.expectsMediaDataInRealTime = false
        let adaptor = AVAssetWriterInputPixelBufferAdaptor(
            assetWriterInput: input,
            sourcePixelBufferAttributes: [
                kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
                kCVPixelBufferWidthKey as String: width,
                kCVPixelBufferHeightKey as String: height,
            ]
        )
        guard writer.canAdd(input) else {
            throw NSError(domain: "PausaVideo", code: 2, userInfo: [
                NSLocalizedDescriptionKey: "The video input could not be configured."
            ])
        }
        writer.add(input)
        writer.startWriting()
        writer.startSession(atSourceTime: .zero)

        var frameIndex: Int64 = 0
        for (index, scene) in scenes.enumerated() {
            let image = renderScene(scene, index: index, root: root)
            let cardsDirectory = root.appendingPathComponent("media/video/cards", isDirectory: true)
            try FileManager.default.createDirectory(at: cardsDirectory, withIntermediateDirectories: true)
            try savePNG(image, to: cardsDirectory.appendingPathComponent(String(format: "scene-%02d.png", index + 1)))
            guard let pixelBuffer = pixelBuffer(from: image) else {
                throw NSError(domain: "PausaVideo", code: 3, userInfo: [
                    NSLocalizedDescriptionKey: "A video frame could not be rendered."
                ])
            }
            let frameCount = max(1, Int((durations[index] * Double(fps)).rounded()))
            for _ in 0..<frameCount {
                while !input.isReadyForMoreMediaData {
                    try await Task.sleep(for: .milliseconds(2))
                }
                let time = CMTime(value: frameIndex, timescale: fps)
                guard adaptor.append(pixelBuffer, withPresentationTime: time) else {
                    throw writer.error ?? NSError(domain: "PausaVideo", code: 4)
                }
                frameIndex += 1
            }
        }

        input.markAsFinished()
        await writer.finishWriting()
        if writer.status != .completed {
            throw writer.error ?? NSError(domain: "PausaVideo", code: 5)
        }
    }

    @MainActor
    static func savePNG(_ image: NSImage, to output: URL) throws {
        guard
            let tiff = image.tiffRepresentation,
            let bitmap = NSBitmapImageRep(data: tiff),
            let png = bitmap.representation(using: .png, properties: [:])
        else {
            throw NSError(domain: "PausaVideo", code: 8, userInfo: [
                NSLocalizedDescriptionKey: "A video card could not be encoded."
            ])
        }
        try png.write(to: output)
    }

    @MainActor
    static func renderScene(_ scene: Scene, index: Int, root: URL) -> NSImage {
        let image = NSImage(size: NSSize(width: width, height: height))
        image.lockFocus()
        defer { image.unlockFocus() }

        let rect = NSRect(x: 0, y: 0, width: width, height: height)
        NSColor(calibratedRed: 0.98, green: 0.96, blue: 0.91, alpha: 1).setFill()
        rect.fill()

        let glow = NSGradient(colors: [
            NSColor(calibratedRed: 0.91, green: 0.95, blue: 0.90, alpha: 0.8),
            NSColor(calibratedRed: 0.98, green: 0.96, blue: 0.91, alpha: 0),
        ])
        glow?.draw(fromCenter: NSPoint(x: 1660, y: 160), radius: 0, toCenter: NSPoint(x: 1660, y: 160), radius: 680, options: [])

        let forest = NSColor(calibratedRed: 0.06, green: 0.24, blue: 0.21, alpha: 1)
        let sage = NSColor(calibratedRed: 0.31, green: 0.42, blue: 0.39, alpha: 1)
        let gold = NSColor(calibratedRed: 0.77, green: 0.59, blue: 0.27, alpha: 1)

        let eyebrow = "PAUSA  /  OPENAI BUILD WEEK"
        drawText(eyebrow, in: NSRect(x: 110, y: 948, width: 900, height: 46), font: .systemFont(ofSize: 25, weight: .heavy), color: forest, tracking: 5)
        drawText(scene.title, in: NSRect(x: 110, y: 650, width: 900, height: 250), font: .systemFont(ofSize: scene.layout == .closing ? 92 : 74, weight: .black), color: forest)
        drawText(scene.kicker, in: NSRect(x: 112, y: 505, width: 820, height: 125), font: .systemFont(ofSize: 34, weight: .regular), color: sage)

        let numberRect = NSRect(x: 112, y: 420, width: 84, height: 84)
        let numberPath = NSBezierPath(roundedRect: numberRect, xRadius: 42, yRadius: 42)
        forest.setFill()
        numberPath.fill()
        drawText("\(index + 1)", in: NSRect(x: 112, y: 437, width: 84, height: 50), font: .systemFont(ofSize: 28, weight: .bold), color: .white, alignment: .center)

        switch scene.layout {
        case .phone:
            if let relativePath = scene.imagePath,
               let source = NSImage(contentsOf: root.appendingPathComponent(relativePath)) {
                let frame = NSRect(x: 1120, y: 75, width: 650, height: 930)
                NSColor.white.withAlphaComponent(0.78).setFill()
                NSBezierPath(roundedRect: frame.insetBy(dx: -22, dy: -22), xRadius: 56, yRadius: 56).fill()
                drawAspectFill(source, in: frame, cornerRadius: 38)
            }
        case .evidence:
            let items = index == 6
                ? ["Conversation → product decision", "Code + safety tests", "Public deployment + evidence"]
                : ["12 / 12 live safety evaluations", "Spanish + English", "Apache 2.0 open source"]
            for (itemIndex, item) in items.enumerated() {
                let card = NSRect(x: 1050, y: 700 - CGFloat(itemIndex) * 230, width: 720, height: 175)
                NSColor.white.withAlphaComponent(0.78).setFill()
                NSBezierPath(roundedRect: card, xRadius: 34, yRadius: 34).fill()
                gold.setFill()
                NSBezierPath(roundedRect: NSRect(x: card.minX + 34, y: card.minY + 44, width: 12, height: 88), xRadius: 6, yRadius: 6).fill()
                drawText(item, in: NSRect(x: card.minX + 76, y: card.minY + 46, width: 600, height: 90), font: .systemFont(ofSize: 35, weight: .bold), color: forest)
            }
        case .closing:
            if let mark = NSImage(contentsOf: root.appendingPathComponent("public/brand/pausa-app-icon-1024.png")) {
                mark.draw(in: NSRect(x: 1180, y: 410, width: 430, height: 430))
            }
            if let qr = NSImage(contentsOf: root.appendingPathComponent("public/pausa-qr.png")) {
                NSColor.white.setFill()
                NSBezierPath(roundedRect: NSRect(x: 1285, y: 95, width: 220, height: 220), xRadius: 28, yRadius: 28).fill()
                qr.draw(in: NSRect(x: 1305, y: 115, width: 180, height: 180))
            }
        }

        drawText(
            scene.narration,
            in: NSRect(x: 110, y: 95, width: 890, height: 300),
            font: .systemFont(ofSize: 27, weight: .medium),
            color: forest.withAlphaComponent(0.9)
        )
        drawText("pausa-digital.elesdex.chatgpt.site", in: NSRect(x: 110, y: 34, width: 900, height: 40), font: .systemFont(ofSize: 21, weight: .semibold), color: sage)
        return image
    }

    @MainActor
    static func drawText(
        _ text: String,
        in rect: NSRect,
        font: NSFont,
        color: NSColor,
        tracking: CGFloat = 0,
        alignment: NSTextAlignment = .left
    ) {
        let style = NSMutableParagraphStyle()
        style.alignment = alignment
        style.lineBreakMode = .byWordWrapping
        style.lineSpacing = 5
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color,
            .paragraphStyle: style,
            .kern: tracking,
        ]
        text.draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attributes)
    }

    @MainActor
    static func drawAspectFill(_ image: NSImage, in rect: NSRect, cornerRadius: CGFloat) {
        NSGraphicsContext.saveGraphicsState()
        NSBezierPath(roundedRect: rect, xRadius: cornerRadius, yRadius: cornerRadius).addClip()
        let sourceSize = image.size
        let scale = max(rect.width / sourceSize.width, rect.height / sourceSize.height)
        let size = NSSize(width: sourceSize.width * scale, height: sourceSize.height * scale)
        let target = NSRect(
            x: rect.midX - size.width / 2,
            y: rect.midY - size.height / 2,
            width: size.width,
            height: size.height
        )
        image.draw(in: target, from: .zero, operation: .sourceOver, fraction: 1)
        NSGraphicsContext.restoreGraphicsState()
    }

    @MainActor
    static func pixelBuffer(from image: NSImage) -> CVPixelBuffer? {
        var pixelBuffer: CVPixelBuffer?
        let attributes: [CFString: Any] = [
            kCVPixelBufferCGImageCompatibilityKey: true,
            kCVPixelBufferCGBitmapContextCompatibilityKey: true,
        ]
        guard CVPixelBufferCreate(
            kCFAllocatorDefault,
            width,
            height,
            kCVPixelFormatType_32BGRA,
            attributes as CFDictionary,
            &pixelBuffer
        ) == kCVReturnSuccess, let pixelBuffer else { return nil }

        CVPixelBufferLockBaseAddress(pixelBuffer, [])
        defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, []) }
        guard let base = CVPixelBufferGetBaseAddress(pixelBuffer) else { return nil }
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        guard let context = CGContext(
            data: base,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
            space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
        ) else { return nil }

        var proposed = NSRect(x: 0, y: 0, width: width, height: height)
        guard let cgImage = image.cgImage(forProposedRect: &proposed, context: nil, hints: nil) else { return nil }
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        return pixelBuffer
    }

    @MainActor
    static func createProofFrame(video: URL, output: URL) throws {
        let asset = AVURLAsset(url: video)
        let generator = AVAssetImageGenerator(asset: asset)
        generator.appliesPreferredTrackTransform = true
        generator.requestedTimeToleranceBefore = .zero
        generator.requestedTimeToleranceAfter = .zero
        var actualTime = CMTime.zero
        let frame = try generator.copyCGImage(
            at: CMTime(seconds: 2, preferredTimescale: 600),
            actualTime: &actualTime
        )
        let image = NSImage(cgImage: frame, size: NSSize(width: width, height: height))
        try savePNG(image, to: output)
    }

    static func combine(video: URL, audio: URL, output: URL) async throws {
        let videoAsset = AVURLAsset(url: video)
        let audioAsset = AVURLAsset(url: audio)
        let composition = AVMutableComposition()

        guard
            let sourceVideo = try await videoAsset.loadTracks(withMediaType: .video).first,
            let targetVideo = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)
        else { throw NSError(domain: "PausaVideo", code: 6) }

        let videoDuration = try await videoAsset.load(.duration)
        try targetVideo.insertTimeRange(CMTimeRange(start: .zero, duration: videoDuration), of: sourceVideo, at: .zero)

        if let sourceAudio = try await audioAsset.loadTracks(withMediaType: .audio).first,
           let targetAudio = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
            let audioDuration = try await audioAsset.load(.duration)
            try targetAudio.insertTimeRange(CMTimeRange(start: .zero, duration: audioDuration), of: sourceAudio, at: .zero)
        }

        guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else {
            throw NSError(domain: "PausaVideo", code: 7)
        }
        try await exporter.export(to: output, as: .mp4)
    }

    static func makeSRT(scenes: [Scene], durations: [Double], output: URL) throws {
        var cursor = 0.0
        var blocks: [String] = []
        for (index, scene) in scenes.enumerated() {
            let end = cursor + durations[index]
            blocks.append("\(index + 1)\n\(timestamp(cursor)) --> \(timestamp(end))\n\(scene.narration)\n")
            cursor = end
        }
        try blocks.joined(separator: "\n").write(to: output, atomically: true, encoding: .utf8)
    }

    static func timestamp(_ seconds: Double) -> String {
        let milliseconds = Int((seconds * 1000).rounded())
        let hours = milliseconds / 3_600_000
        let minutes = (milliseconds / 60_000) % 60
        let secs = (milliseconds / 1_000) % 60
        let ms = milliseconds % 1_000
        return String(format: "%02d:%02d:%02d,%03d", hours, minutes, secs, ms)
    }
}
