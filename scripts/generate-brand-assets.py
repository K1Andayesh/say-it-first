"""Generate the Say It First app icon, Android adaptive layers, and splash mark.

The mark is intentionally vector-like: a conversation bubble enclosing three
voice bars. It stays legible at launcher size and uses the in-app ink, ivory,
and coral palette. Pillow is used only to rasterize this reproducible artwork.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "apps" / "mobile" / "assets" / "images"
SCALE = 4
INK = (9, 10, 18)
INK_RAISED = (17, 18, 29)
IVORY = (244, 240, 232)
CORAL = (255, 107, 95)


def box(coords, scale=SCALE):
    return tuple(round(value * scale) for value in coords)


def make_canvas(size, background=None):
    return Image.new("RGBA", (size * SCALE, size * SCALE), background or (0, 0, 0, 0))


def draw_mark(canvas, frame, *, monochrome=False):
    """Draw a speech-bubble silhouette and a three-beat voice motif."""
    x, y, width, height = frame
    sx = width / 1024
    sy = height / 1024

    def rect(x1, y1, x2, y2):
        return box((x + x1 * sx, y + y1 * sy, x + x2 * sx, y + y2 * sy))

    def point(px, py):
        return box((x + px * sx, y + py * sy))

    outer = (*IVORY, 255) if not monochrome else (255, 255, 255, 255)
    inner = (*INK_RAISED, 255) if not monochrome else (0, 0, 0, 0)
    voice = (*CORAL, 255) if not monochrome else (255, 255, 255, 255)
    draw = ImageDraw.Draw(canvas)

    # The short tail sits behind the body so its joins stay smooth at small sizes.
    draw.polygon(
        [point(320, 670), point(260, 824), point(472, 689)], fill=outer
    )
    draw.rounded_rectangle(rect(188, 190, 836, 710), radius=164 * SCALE * sx, fill=outer)
    if not monochrome:
        draw.polygon(
            [point(346, 647), point(338, 729), point(447, 646)], fill=inner
        )
        draw.rounded_rectangle(
            rect(247, 249, 777, 651), radius=111 * SCALE * sx, fill=inner
        )
    else:
        # The monochrome drawable relies on an alpha hole, not a black fill.
        draw.polygon(
            [point(346, 647), point(338, 729), point(447, 646)], fill=inner
        )
        draw.rounded_rectangle(
            rect(247, 249, 777, 651), radius=111 * SCALE * sx, fill=inner
        )

    for left, top, right, bottom in (
        (360, 424, 418, 548),
        (483, 349, 541, 548),
        (606, 397, 664, 548),
    ):
        draw.rounded_rectangle(
            rect(left, top, right, bottom), radius=29 * SCALE * sx, fill=voice
        )


def downsample(canvas, size):
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def make_primary_icon():
    canvas = make_canvas(1024)
    draw = ImageDraw.Draw(canvas)
    for row in range(canvas.height):
        t = row / (canvas.height - 1)
        color = (
            round(20 + (INK[0] - 20) * t),
            round(20 + (INK[1] - 20) * t),
            round(36 + (INK[2] - 36) * t),
            255,
        )
        draw.line((0, row, canvas.width, row), fill=color)

    glow = make_canvas(1024)
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(box((240, 220, 784, 764)), fill=(255, 107, 95, 65))
    glow = glow.filter(ImageFilter.GaussianBlur(104 * SCALE))
    canvas.alpha_composite(glow)
    draw_mark(canvas, (0, 0, 1024, 1024))
    downsample(canvas, 1024).convert("RGB").save(ASSETS / "icon.png", optimize=True)


def make_adaptive_layers():
    background = make_canvas(512, (*INK, 255))
    downsample(background, 512).convert("RGB").save(
        ASSETS / "android-icon-background.png", optimize=True
    )

    foreground = make_canvas(512)
    # Android's adaptive-icon mask keeps the central safe zone. Leave generous
    # transparent margins so the tail and voice bars survive circular masks.
    draw_mark(foreground, (116, 116, 280, 280))
    downsample(foreground, 512).save(
        ASSETS / "android-icon-foreground.png", optimize=True
    )

    monochrome = make_canvas(432)
    draw_mark(monochrome, (96, 96, 240, 240), monochrome=True)
    downsample(monochrome, 432).save(
        ASSETS / "android-icon-monochrome.png", optimize=True
    )


def make_splash():
    canvas = make_canvas(512)
    draw_mark(canvas, (44, 36, 424, 424))
    downsample(canvas, 512).save(ASSETS / "splash-icon.png", optimize=True)


if __name__ == "__main__":
    make_primary_icon()
    make_adaptive_layers()
    make_splash()
    print("Generated Say It First icon, adaptive layers, and splash mark")
