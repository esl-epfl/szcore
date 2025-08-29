// Function to convert HSV to RGB
export function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export function getThemePurpleColorForScore(score) {
    // Normalize the score between 0 and 1
    const normalizedScore = score / 100;

    const hue_max = 262;
    const saturation_max = 76;
    const value_max = 93;

    // Define color changing saturation
    const saturation = normalizedScore * saturation_max;

    const rgb = HSVtoRGB(hue_max / 360.0, saturation / 100.0, value_max / 100.0);
    const red = rgb.r;
    const green = rgb.g;
    const blue = rgb.b;

    // Calculate the luminance of the color to determine text color
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const textColor = luminance > 128 ? 'black' : 'white'; // Dark text for light background, light text for dark background

    // Return the color and text color
    return {
        bgColor: `rgb(${red}, ${green}, ${blue})`,
        textColor: textColor
    };
}

export function getColorForScore(score) {
    // This is the purple theme color, which seems to be the preferred one.
    return getThemePurpleColorForScore(score);
}
