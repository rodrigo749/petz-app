/**
 * blobUtils.js
 * Utilitários para trabalhar com blob base64 e convertê-los para exibição
 */

/**
 * Converte blob base64 de volta para URL exibível
 * @param {string} blobBase64 - String base64 da imagem
 * @param {string} mimeType - Tipo MIME (ex: "image/jpeg", "image/png")
 * @returns {string|null} URL de objeto para usar em <img src={} /> ou null se inválido
 *
 * @example
 * const imageUrl = convertBlobToImageUrl(blobBase64Data, 'image/jpeg');
 * <img src={imageUrl} alt="pet" />
 */
export const convertBlobToImageUrl = (blobBase64, mimeType = 'image/jpeg') => {
  if (!blobBase64) return null;

  // Suporta objeto { blob, mimeType }
  if (typeof blobBase64 === 'object') {
    const obj = blobBase64;
    if (obj?.blob && typeof obj.blob === 'string') {
      return convertBlobToImageUrl(obj.blob, obj.mimeType || mimeType);
    }
    // Suporta retorno tipo Buffer do backend: { type: 'Buffer', data: [...] }
    if (Array.isArray(obj?.data)) {
      const bytes = new Uint8Array(obj.data);
      const blob = new Blob([bytes], { type: mimeType });
      return URL.createObjectURL(blob);
    }
    return null;
  }

  if (blobBase64 instanceof Uint8Array) {
    const blob = new Blob([blobBase64], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  if (blobBase64 instanceof ArrayBuffer) {
    const blob = new Blob([new Uint8Array(blobBase64)], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  if (Array.isArray(blobBase64)) {
    const blob = new Blob([new Uint8Array(blobBase64)], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  if (typeof blobBase64 !== 'string') return null;

  try {
    // Verifica se já é uma URL (URL antiga ou caminho)
    if (
      blobBase64.startsWith('http') ||
      blobBase64.startsWith('/uploads/') ||
      blobBase64.startsWith('/images/') ||
      blobBase64.startsWith('blob:')
    ) {
      return blobBase64; // Retorna como está
    }

    // Aceita data URL completo (data:image/jpeg;base64,xxxx)
    let base64Payload = blobBase64;
    if (blobBase64.startsWith('data:')) {
      const parts = blobBase64.split(',');
      base64Payload = parts.length > 1 ? parts[1] : '';
      const mimeMatch = blobBase64.match(/^data:(.*?);base64,/);
      if (mimeMatch && mimeMatch[1]) mimeType = mimeMatch[1];
    }

    // Decodifica base64 para string binária
    const byteCharacters = atob(base64Payload);

    // Converte string para array de bytes
    const byteArray = new Uint8Array(
      [...byteCharacters].map(char => char.charCodeAt(0))
    );

    // Cria Blob a partir dos bytes
    const blob = new Blob([byteArray], { type: mimeType });

    // Cria URL de objeto para o Blob
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error('Erro ao converter blob para URL:', error);
    return null;
  }
};

/**
 * Libera memória da URL de objeto
 * Deve ser chamado em useEffect cleanup para evitar memory leak
 *
 * @param {string} url - URL de objeto criada por URL.createObjectURL()
 *
 * @example
 * useEffect(() => {
 *   return () => {
 *     revokeImageUrl(imageUrl);
 *   };
 * }, [imageUrl]);
 */
export const revokeImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao revogar URL de objeto:', error);
    }
  }
};

/**
 * Detecta se uma string é blob base64 ou URL
 * @param {string} imageData - String a verificar
 * @returns {boolean} true se for base64, false se for URL
 */
export const isBase64Blob = (imageData) => {
  if (!imageData || typeof imageData !== 'string') return false;

  // Começa com dados base64 típicos de imagem
  const base64Prefixes = ['iVBOR', '/9j/', 'Qk0=', 'R0lG']; // PNG, JPEG, BMP, GIF
  return base64Prefixes.some(prefix => imageData.startsWith(prefix));
};

/**
 * Prepara imagem para envio ao backend
 * Se for blob, retorna como está
 * Se for URL local, converte para blob
 * @param {string|File} image - Imagem em qualquer formato
 * @returns {Promise<string>} Base64 pronto para enviar
 */
export const prepareImageForUpload = async (image) => {
  if (typeof image === 'string') {
    return image; // Já é base64 ou URL
  }

  if (image instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  }

  throw new Error('Formato de imagem inválido');
};
