export async function uploadImage(file) {
  if (!file) return null;
  const form = new FormData();
  form.append('file', file, file.name);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ message: 'Erro no upload' }));
    throw new Error(err.message || err.error || 'Erro no upload');
  }
  const data = await res.json();
  if (data.blob && data.mimeType) {
    return `data:${data.mimeType};base64,${data.blob}`;
  }
  return data.url || null;
}

/**
 * Returns a valid <img> src from a stored image value.
 * Handles URLs, data URLs, blob URLs, and raw base64 strings.
 */
export function getImageSrc(imagem) {
  if (!imagem) return "/images/default.png";
  if (
    imagem.startsWith("data:") ||
    imagem.startsWith("http") ||
    imagem.startsWith("/") ||
    imagem.startsWith("blob:")
  ) {
    return imagem;
  }
  // Raw base64 string – detect MIME type from magic bytes prefix
  let mimeType = "image/jpeg";
  if (imagem.startsWith("iVBOR")) mimeType = "image/png";
  else if (imagem.startsWith("R0lG")) mimeType = "image/gif";
  else if (imagem.startsWith("UklG")) mimeType = "image/webp";
  return `data:${mimeType};base64,${imagem}`;
}

export async function savePet(pet) {
  const res = await fetch('/api/pets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet),
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: 'Erro ao salvar' }));
    throw new Error(err.error || 'Erro ao salvar');
  }
  return await res.json();
}
