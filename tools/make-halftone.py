#!/usr/bin/env python3
"""
make-halftone.py — Membuat versi halftone dari foto hero.

APA INI
  Mengubah foto biasa menjadi gambar dua tinta (Ink di atas Paper) yang
  titik-titiknya membesar-mengecil mengikuti terang-gelap foto — persis
  seperti hasil cetak koran. Gambar inilah yang muncul saat plat hero
  di-hover.

KAPAN DIJALANKAN
  Setiap kali kamu mengganti foto hero, jalankan ulang skrip ini.
  Tanpa itu, keadaan hover akan tetap memakai halftone dari foto LAMA —
  dan itu terjadi tanpa pesan error apa pun, jadi mudah terlewat.

CARA PAKAI
  pip install pillow numpy
  python3 tools/make-halftone.py

  Opsi (semua ada nilai default-nya, jadi tanpa opsi pun jalan):
    --input   foto sumber       (default: assets/images/home/asset-1.jpeg)
    --output  berkas hasil      (default: assets/images/home/asset-1-halftone.png)
    --tone    auto|gentle|raw   (default: auto)
    --pitch   ukuran titik      (default: 16)
    --size    resolusi keluaran (default: 1632)
    --invert  balik tintanya    (default: tidak)

  KAPAN PAKAI --invert
    Situs punya dua tema, jadi tiap foto butuh DUA berkas halftone:
      tanpa --invert → titik Ink di atas Paper, untuk tema terang (Paper)
      dengan --invert → titik Paper di atas Ink, untuk tema gelap (Ink)
    Keduanya memakai matriks ambang yang sama, jadi titiknya tumbuh di
    tempat yang persis sama — yang bertukar hanya tintanya.

  Arti pilihan --tone:
    auto   — bayangan dibuka penuh; wajah paling terbaca (default)
    gentle — bayangan dibuka separuh; mood gelap foto agak terjaga
    raw    — tanpa koreksi; paling dramatis, plat nyaris hitam pekat

CATATAN PENTING
  --size wajib habis dibagi --pitch. Nilai default 1632 habis dibagi 16,
  dan juga habis dibagi 4 dan 2 — jadi saat browser mengecilkannya ke
  ukuran plat di layar, penurunannya selalu bilangan bulat dan titiknya
  tidak kena moiré (pola gelombang palsu).
"""

import argparse
import sys
from pathlib import Path

try:
    import numpy as np
    from PIL import Image, ImageFilter
except ImportError as exc:  # pesan yang bisa ditindaklanjuti, bukan traceback
    sys.exit(
        f"Modul yang dibutuhkan belum terpasang ({exc.name}).\n"
        "Jalankan dulu:  pip install pillow numpy"
    )

# Dua tinta situs. Nilainya harus sama dengan --color-headline-ink dan
# --surface-paper di css/style.css; kalau palet berubah, ubah juga di sini.
INK = (42, 39, 34)      # #2a2722
PAPER = (250, 250, 250)  # #fafafa

ROOT = Path(__file__).resolve().parent.parent


def clustered_matrix(n):
    """Matriks ambang berukuran n x n untuk titik halftone.

    Tiap sel diberi peringkat berdasarkan jarak toroidal (jarak yang
    membungkus ke tepi seberang) dari pusat kotak. Cara ini membuat
    titiknya tumbuh dari tengah sebagai bulatan, dan tersusun diagonal
    seperti layar cetak 45 derajat — bukan kotak-kotak.
    """
    yy, xx = np.meshgrid(np.arange(n), np.arange(n))
    c = (n - 1) / 2
    dy = np.minimum(np.abs(yy - c), n - np.abs(yy - c))
    dx = np.minimum(np.abs(xx - c), n - np.abs(xx - c))
    jarak = np.sqrt(dx**2 + dy**2)
    sudut = np.arctan2(yy - c, xx - c)  # pemecah seri agar bulatannya stabil
    urutan = np.lexsort((sudut.ravel(), jarak.ravel()))
    matriks = np.empty(n * n)
    matriks[urutan] = np.arange(n * n)
    return matriks.reshape(n, n).astype(np.float64)


def tone_map(gray, kind):
    """Koreksi tone sebelum dijadikan titik.

    Halftone hitam-di-atas-kertas butuh rentang tone yang terbuka. Foto
    hero ini sangat gelap (lebih dari 90% pixel-nya di bawah 64/255), jadi
    tanpa koreksi hampir seluruh plat jadi tinta pekat dan wajahnya hilang.
    """
    a = np.asarray(gray, dtype=np.float64)

    if kind == "raw":
        return a

    if kind == "auto":
        # Regangkan 0,5%..99,5% persentil ke rentang penuh 0..255.
        lo, hi = np.percentile(a, 0.5), np.percentile(a, 99.5)
        return np.clip((a - lo) / max(hi - lo, 1.0) * 255.0, 0, 255)

    if kind == "gentle":
        lo, hi = np.percentile(a, 1.0), np.percentile(a, 98.0)
        a = np.clip((a - lo) / max(hi - lo, 1.0) * 255.0, 0, 255)
        return 255.0 * (a / 255.0) ** 0.78

    raise ValueError(f"--tone tidak dikenal: {kind}")


def halftone(gray_arr, pitch, invert=False):
    """Ubah array keabuan menjadi gambar dua tinta bertitik.

    invert=False → titik Ink di atas Paper (dipakai tema terang)
    invert=True  → titik Paper di atas plat Ink (dipakai tema gelap)

    Keduanya memakai matriks ambang yang sama, jadi hasilnya bukan sekadar
    negatif foto: titiknya tumbuh di tempat yang persis sama, hanya tintanya
    yang bertukar. Plat gelap karena itu terbaca sebagai pasangan cetak dari
    plat terang, bukan gambar lain.
    """
    ambang = clustered_matrix(pitch) * (256.0 / (pitch * pitch))
    tinggi, lebar = gray_arr.shape
    peta = np.tile(
        ambang,
        (tinggi // pitch, lebar // pitch),
    )
    bertinta = gray_arr <= peta

    latar, tinta = (INK, PAPER) if invert else (PAPER, INK)
    rgb = np.empty((tinggi, lebar, 3), dtype=np.uint8)
    rgb[:] = latar
    rgb[bertinta] = tinta
    return Image.fromarray(rgb, "RGB")


def main():
    p = argparse.ArgumentParser(
        description="Membuat versi halftone dari foto hero.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--input", default="assets/images/home/asset-1.jpeg")
    p.add_argument("--output", default="assets/images/home/asset-1-halftone.png")
    p.add_argument("--tone", default="auto", choices=["auto", "gentle", "raw"])
    p.add_argument("--pitch", type=int, default=16)
    p.add_argument("--size", type=int, default=1632)
    p.add_argument(
        "--invert",
        action="store_true",
        help="titik Paper di atas plat Ink — berkas untuk tema gelap",
    )
    args = p.parse_args()

    if args.size % args.pitch != 0:
        sys.exit(
            f"--size ({args.size}) harus habis dibagi --pitch ({args.pitch}).\n"
            f"Coba --pitch 16, 12, atau 8 — ketiganya membagi {args.size}."
        )

    sumber = ROOT / args.input
    tujuan = ROOT / args.output

    if not sumber.exists():
        sys.exit(
            f"Foto sumber tidak ditemukan: {sumber}\n"
            "Periksa lagi ejaan --input, atau letakkan fotonya di path itu."
        )

    # Turunkan ke abu-abu, lalu skalakan ke resolusi keluaran.
    foto = Image.open(sumber).convert("L").resize(
        (args.size, args.size), Image.LANCZOS
    )

    # Koreksi tone, lalu diburamkan sedikit supaya titiknya tumbuh mulus
    # dan tidak mengikuti bintik-bintik kecil di foto.
    terkoreksi = tone_map(foto, args.tone)
    halus = Image.fromarray(terkoreksi.astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(args.pitch * 0.45)
    )

    hasil = halftone(np.asarray(halus, dtype=np.float64), args.pitch, args.invert)
    tujuan.parent.mkdir(parents=True, exist_ok=True)
    hasil.save(tujuan, optimize=True)

    # Bagian gelap diukur dari hasil jadinya, bukan dari mode tinta: pada
    # --invert yang gelap adalah latarnya, jadi angkanya wajar berbeda jauh.
    gelap = (np.asarray(hasil.convert("L")) < 128).mean() * 100
    # Ditampilkan relatif terhadap root repo bila memungkinkan; kalau
    # hasilnya disimpan di luar repo, tampilkan path lengkapnya saja.
    try:
        label = tujuan.relative_to(ROOT)
    except ValueError:
        label = tujuan
    print(f"Selesai: {label}")
    print(
        f"  {args.size}x{args.size}px · titik {args.pitch}px · "
        f"tone '{args.tone}' · {'terbalik' if args.invert else 'normal'} · "
        f"bidang gelap {gelap:.1f}% ({tujuan.stat().st_size // 1024} KB)"
    )
    print("\nJangan lupa: kalau nama berkasnya berubah, perbarui juga")
    print("HOME.IMAGE_HALFTONE (dan HOME.IMAGE_HALFTONE_INK untuk versi")
    print("--invert) di data/data.json.")


if __name__ == "__main__":
    main()
