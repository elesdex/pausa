#!/bin/sh

set -eu

project_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
env_file="$project_root/.env.local"
tmp_file="$(mktemp "$project_root/.env.local.tmp.XXXXXX")"

restore_terminal() {
  stty echo 2>/dev/null || true
  rm -f "$tmp_file"
}

trap restore_terminal EXIT HUP INT TERM

printf '\nConfigurar OPENAI_API_KEY para Pausa\n'
printf 'La clave quedará solamente en .env.local y no aparecerá en pantalla.\n\n'
printf 'Pega tu clave de OpenAI y presiona Enter: '
stty -echo
IFS= read -r api_key
stty echo
printf '\n'

case "$api_key" in
  sk-*) ;;
  *)
    printf 'La clave no tiene el formato esperado (debe comenzar con sk-).\n' >&2
    exit 1
    ;;
esac

if [ "${#api_key}" -lt 20 ]; then
  printf 'La clave parece incompleta. No se guardó ningún cambio.\n' >&2
  exit 1
fi

umask 077
if [ -f "$env_file" ]; then
  grep -v '^OPENAI_API_KEY=' "$env_file" > "$tmp_file" || true
fi
printf 'OPENAI_API_KEY=%s\n' "$api_key" >> "$tmp_file"
mv "$tmp_file" "$env_file"
chmod 600 "$env_file"
unset api_key
trap - EXIT HUP INT TERM

printf 'Listo. La clave se guardó localmente y está excluida de Git.\n'
printf 'Ya puedes cerrar esta ventana y volver a Codex.\n\n'
