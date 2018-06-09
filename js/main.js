/**
 * Created by Kim on 2018-05-17.
 */
(() => {
    const canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        img = document.getElementById('img'),
        video = document.getElementById('video');

    navigator.getMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

    console.log("Getting Media Devises");
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 400,
            height: 400
        },
        audio: false
    }).then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };
    }).catch((error) => {
        console.error(error);
    });

    video.addEventListener('play', ()=> {
        let w = video.width,
            h = video.height;
        draw(video,img, context, w, h)
    }, false);

    let frameCount = 0;
    let val = 60;
    function draw(vid,img, ctx, w, h){
        let image, data, r, g, b, i, rr, gg, bb, hue, s, v, delta, c_min, background_image, background_data;
        ctx.drawImage(vid, 0, 0, w, h);
        image = ctx.getImageData(0,0,w,h);
        data = image.data;

        ctx.drawImage(img, 0,0);
        background_image = ctx.getImageData(0,0,w,h);
        background_data = background_image.data;

        for(i=0; i < data.length; i += 4){
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            //This part finds green pixels
            rr = r/255;
            gg = g/255;
            bb = b/255;
            v = Math.max(rr,gg,bb);
            c_min =  Math.min(rr,gg,bb);
            delta = v - c_min;

            if(delta < 0.001){
                hue = 0;
            } else {
                if(r >= g && r >= b){
                    hue = 60*( ( ( gg-bb )/delta ) % 6);
                } else if(g >= r && g >= b){
                    hue = 60*( ( ( bb-rr )/delta ) + 2);
                } else{
                    hue = 60*( ( ( rr-gg )/delta ) + 4);
                }
            }

            if (v < 0.001){
                s = 0;
            } else {
                s = delta / v;
            }


            if((hue > 55 && hue < 150) && (s > 0.1) && (v > 0.2)){
                data[i] = background_data[i];
                data[i+1] = background_data[i+1];
                data[i+2] = background_data[i+2];
            } else {
                //data[i] = data[i+1] = data[i+2] = (r+b+g)/3;
            }

        }

        image.data = data;
        ctx.putImageData(image,0,0);
        frameCount++;
        requestAnimationFrame(()=>{
            draw(vid,img, ctx, w, h);
        });
    }

    canvas.addEventListener('click',()=>{
        console.log(val);
    });

})();