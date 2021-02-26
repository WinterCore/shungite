const TWITCH_LOGO = [
    {
        color  : "#000",
        points :[
            { x: 0.06, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 0.6078431372549019 },
            { x: 0.72, y: 0.8823529411764706 },
            { x: 0.52, y: 0.8823529411764706 },
            { x: 0.41, y: 1 },
            { x: 0.25, y: 1 },
            { x: 0.25, y: 0.8823529411764706 },
            { x: 0, y: 0.8823529411764706 },
            { x: 0, y: 0.17647058823529413 },
        ],
    }, {
        color  : "#6444a3",
        points : [
            { x: 0.16, y: 0.08823529411764706 },
            { x: 0.91, y: 0.08823529411764706 },
            { x: 0.91, y: 0.5784313725490197 },
            { x: 0.75, y: 0.7352941176470589 },
            { x: 0.49, y: 0.7352941176470589 },
            { x: 0.37, y: 0.8529411764705882 },
            { x: 0.37, y: 0.8529411764705882 },
            { x: 0.37, y: 0.7352941176470589 },
            { x: 0.16, y: 0.7352941176470589 },
        ]
    }, {
        color  : "#000",
        points : [
            { x: 0.41, y: 0.27450980392156865 },
            { x: 0.49, y: 0.27450980392156865 },
            { x: 0.49, y: 0.5392156862745098 },
            { x: 0.41, y: 0.5392156862745098 },
        ]
    }, {
        color  : "#000",
        points : [
            { x: 0.66, y: 0.27450980392156865 },
            { x: 0.74, y: 0.27450980392156865 },
            { x: 0.74, y: 0.5392156862745098 },
            { x: 0.66, y: 0.5392156862745098 },
        ]
    }
];

type DrawArgs = {
    parent     : HTMLElement,
    canvas     : HTMLCanvasElement,
    logoWidth  : number,
    logoHeight : number;
    angle      : number; // Going above 90 degrees will crash it (Recommended value: < (Math.PI / 8))
    speed      : number;
};

function init({ parent, canvas, logoWidth: desiredLogoWidth, logoHeight: desiredLogoHeight, angle, speed }: DrawArgs) {
    const ctx = canvas.getContext("2d")!;
    let w: number, h: number, shiftY: number, shiftX: number, odd: boolean, logoWidth: number, logoHeight: number, animId: number;

    let logos: { x: number, y: number }[] = [];
    let scaledLogo: typeof TWITCH_LOGO;

    const createLogos = () => {
        logos = [];
        const cols = Math.ceil((w + shiftX) / logoWidth);
        let rows = Math.ceil((h + shiftY * 2) / logoHeight);
        odd = rows % 2 === 1;
        if (odd) rows += 1;
        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < cols; x += 1) {
                if (x % 2 === y % 2) {
                    logos.push({ x: logoWidth * x, y: logoHeight * y - shiftY });
                }
            }
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.rotate(angle);
        for (let logo of logos) {
            for (const path of scaledLogo) {
                ctx.beginPath();
                ctx.lineTo(path.points[0].x + logo.x, path.points[0].y + logo.y - shiftY);
                for (let i = 1; i < path.points.length; i += 1) {
                    const point = path.points[i];
                    ctx.lineTo(point.x + logo.x, point.y + logo.y - shiftY);
                }
                ctx.closePath();

                ctx.save();
                ctx.fillStyle = path.color;
                ctx.fill();
                ctx.restore();
            }
        }

        ctx.restore();

    };

    const update = () => {
        for (let logo of logos) {
            logo.y += speed;
            if (logo.y >= h + shiftY + (odd ? logoHeight : 0)) {
                logo.y = -shiftY + ((h + shiftY * 2) % logoHeight) - logoHeight;
            }
        }
    };

    const loop = () => {
        draw();
        update();
        animId = window.requestAnimationFrame(loop);
    };

    const init = () => {
        const { width, height } = parent.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        w = width;
        h = height;
        shiftY = Math.sin(angle) * w;
        shiftX = Math.sin(angle) * (h + shiftY * 2);
        let scaleMultiplier = Math.max(Math.max(w, h) / 1920, 1);
        logoHeight = desiredLogoHeight * scaleMultiplier;
        logoWidth  = desiredLogoWidth * scaleMultiplier;
        scaledLogo = TWITCH_LOGO.map(({ points, color }) => ({
            color,
            points: points.map(({ x, y }) => ({
                x: x * logoWidth,
                y: y * logoHeight,
            })),
        })); 
        createLogos();
    };

    window.addEventListener("resize", init);
    init();

    animId = window.requestAnimationFrame(loop);
    const cleanup = () => {
        window.removeEventListener("resize", init);
        window.cancelAnimationFrame(animId);
    };
    return { cleanup };
}

export default init;