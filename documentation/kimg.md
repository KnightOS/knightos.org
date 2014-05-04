---
# vim: tw=82
title: KnightOS image formats
layout: base
---

# KnightOS image formats

**Note**: All details may change before the initial release.

Images, due to their potential size, can be compressed or uncompressed and using a palette or not.
These information are given as a header defined as follows :

| Address | Length  | Description                            |
|:--------|:--------|:---------------------------------------|
| 0x0000  | 4       | The literal ASCII string "KIMG"        |
| 0x0004  | 1       | A format byte (see below)              |
| 0x0005  | 2       | A width word (in pixels)               |
| 0x0007  | 1       | A height byte (in pixels)              |
| 0x0008  | 1       | How many palette entries if necessary  |
| 0x0009  | - - - - | 2-bytes palette entries if necessary   |
| - - - - | - - - - | Image data                             |

The format byte is defined as follows :

| Bit 7 | 6 | 5 | 4 |       3 - 2      |     1     |    0    |
|:------|:--|:--|:--|:-----------------|:----------|:--------|
| - - - | - | - | - | Compression type | Palette ? | Color ? |

The width must not be over 320 for a color image and not over 96 for a monochrome image, and the height must not be over 240 for a color image and not over 64 for a monochrome image.

A monochrome image can not use a palette, but can be compressed. The compression technique used is defined by two bits as follows :

|       00       | 01  |           10            |           11            |
|:---------------|:----|:------------------------|:------------------------|
| No compression | RLE | Reserved for future use | Reserved for future use |

If the image is both compressed and paletted, it should be decompressed and then displayed using the palette that will result of the decompression. If the image uses no palette, that means the image data should be located at offset 0x0008. The compression **can never apply** to the ASCII string "KIMG", the format byte, the width word or the height byte. If you want to compress your data, you **must** start compressing from 0x0008.

## Raw image data

This is a "normal" image ; uncompressed and using no palette, it's already ready for direct write to the LCD or a screen buffer. They are the fastest image type to work with, but can rapidly take a lot of memory. For a color image, each pixel is encoded in R5G6B5 format, thus taking two bytes. For a monochrome image, each byte encodes 8 pixels.

The header for a raw monochrome image would be as follows :

{% highlight nasm %}
    .db "KIMG"
    .db 0b00000000 ; non-compressed and non-paletted monochrome image
    .dw 96 ; width of 96 pixels
    .db 64 ; height of 64 pixels
    .db 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff ; one row is 12 bytes since 12 * 8 = 96 pixels
    ; etc ...
{% endhighlight %}

And the header for a raw color image would be the same, except that the format byte would be `0b00000001` and each pixel would be two bytes long instead of one bit long.

## Paletted images

Only color images can use palettes. Instead of using two bytes per pixel to indicate its color in R5G6B5 format, each pixel is one byte and is used as an offset to a table of colors.

The header for a paletted color image would be as follows :

{% highlight nasm %}
    .db "KIMG"
    .db 0b00000011 ; paletted color image
    .dw 16
    .db 16
    .db 4 ; 4 possible colors
    .dw 0x0000, 0x00f1, 0xe007, 0x1f00 ; the 4 colors
    .db 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3 ; 16 one-byte pixels
    ; etc ...
{% endhighlight %}
