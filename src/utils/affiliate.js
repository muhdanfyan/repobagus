/**
 * Utility untuk menangani URL affiliate dan monetisasi
 */

export const SKOM_AFFILIATE_ID = 'skomindo';

/**
 * Memproses URL untuk menyematkan parameter affiliate jika berlaku
 * @param {string} url - URL original
 * @returns {string} URL yang sudah disisipi parameter affiliate
 */
export function getMonetizedUrl(url) {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();

    // Contoh: Jika domain adalah Vercel, Supabase, DigitalOcean
    // Tambahkan custom logic di sini sesuai dengan format affiliate masing-masing vendor
    if (domain.includes('digitalocean.com') || 
        domain.includes('vercel.com') || 
        domain.includes('supabase.com')) {
      
      // Jika mereka pakai parameter ?ref=
      parsedUrl.searchParams.set('ref', SKOM_AFFILIATE_ID);
      return parsedUrl.toString();
    }

    // Untuk GitHub atau link lainnya, kita bisa tambahkan ref tracking untuk analitik internal (opsional)
    if (domain.includes('github.com')) {
      parsedUrl.searchParams.set('ref', 'sarjanakomputer.id');
      return parsedUrl.toString();
    }

    return url;
  } catch (e) {
    // Jika URL tidak valid, kembalikan apa adanya
    return url;
  }
}

/**
 * Generate WhatsApp URL untuk Lead Generation
 * @param {string} repoName - Nama repositori yang sedang dilihat
 * @returns {string} URL WhatsApp web/api
 */
export function getWhatsAppLeadUrl(repoName) {
  // Ganti dengan nomor WhatsApp resmi CV SKOM
  const WA_NUMBER = '6281234567890'; 
  const message = `Halo Tim SKOM, saya tertarik dengan repo *${repoName}* dan butuh bantuan untuk implementasi/customisasi.`;
  
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
