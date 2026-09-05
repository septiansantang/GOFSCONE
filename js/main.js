// ============================================================
// GOFSCONE WEBSITE
// MAIN.JS
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


// ============================================================
// GSAP PERFORMANCE
// ============================================================

gsap.config({
    nullTargetWarn: false
});

gsap.ticker.lagSmoothing(500, 33);


// ============================================================
// DOM ELEMENTS
// ============================================================

const canvas =
    document.querySelector('#rocky-canvas');

const hero =
    document.querySelector('.hero');

const heroContent =
    document.querySelector('.hero-content');

const rockyContainer =
    document.querySelector('.rocky-container');

const rockyIntro =
    document.querySelector('.rocky-intro');

const scrollIndicator =
    document.querySelector('.scroll-indicator');

const story =
    document.querySelector('.story');

const storyItems =
    document.querySelectorAll('.story-item');

const info =
    document.querySelector('.info');

const galeri =
    document.querySelector('.galeri');


// ============================================================
// DEVICE
// ============================================================

function isMobile() {

    return window.innerWidth <= 768;

}

function isSmallMobile() {

    return window.innerWidth <= 480;

}


// ============================================================
// THREE.JS
// ============================================================

if (!canvas || !rockyContainer) {

    console.error(
        'Canvas Rocky atau Rocky Container tidak ditemukan.'
    );

} else {

    // --------------------------------------------------------
    // SCENE
    // --------------------------------------------------------

    const scene =
        new THREE.Scene();


    // --------------------------------------------------------
    // CAMERA
    // --------------------------------------------------------

    const camera =
        new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            1000
        );

    camera.position.set(
        0,
        0,
        8
    );


    // --------------------------------------------------------
    // RENDERER
    // --------------------------------------------------------

    const renderer =
        new THREE.WebGLRenderer({

            canvas: canvas,

            alpha: true,

            antialias: true,

            powerPreference: 'high-performance'

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    // --------------------------------------------------------
    // RESIZE RENDERER
    // --------------------------------------------------------

    function resizeRenderer() {

        const width =
            rockyContainer.clientWidth;

        const height =
            rockyContainer.clientHeight;


        if (
            width <= 0 ||
            height <= 0
        ) {

            return;

        }


        renderer.setSize(
            width,
            height,
            false
        );


        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

    }


    resizeRenderer();


    // ========================================================
    // LIGHTING
    // ========================================================

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            5
        );

    scene.add(
        ambientLight
    );


    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            5
        );

    directionalLight.position.set(
        5,
        5,
        5
    );

    scene.add(
        directionalLight
    );


    // ========================================================
    // ROCKY MODEL
    // ========================================================

    const loader =
        new GLTFLoader();

    let rocky = null;


    loader.load(

        'assets/3d/3d-model.glb',

        function (gltf) {

            rocky =
                gltf.scene;


            scene.add(
                rocky
            );


            // ------------------------------------------------
            // CENTER MODEL
            // ------------------------------------------------

            const box =
                new THREE.Box3()
                    .setFromObject(rocky);


            const center =
                box.getCenter(
                    new THREE.Vector3()
                );


            rocky.position.sub(
                center
            );


            // ------------------------------------------------
            // NORMALIZE SIZE
            // ------------------------------------------------

            const size =
                box.getSize(
                    new THREE.Vector3()
                );


            const maxSize =
                Math.max(
                    size.x,
                    size.y,
                    size.z
                );


            const targetSize = 3;


            if (maxSize > 0) {

                const scale =
                    targetSize /
                    maxSize;

                rocky.scale.setScalar(
                    scale
                );

            }


            rocky.position.set(
                0,
                0,
                0
            );


            console.log(
                'Rocky berhasil dimuat.'
            );

        },

        function (progress) {

            if (
                progress.total > 0
            ) {

                const percent =
                    (
                        progress.loaded /
                        progress.total
                    ) * 100;

                console.log(
                    `Rocky loading: ${percent.toFixed(0)}%`
                );

            }

        },

        function (error) {

            console.error(
                'Gagal memuat Rocky:',
                error
            );

        }

    );


    // ========================================================
    // ROCKY ANIMATION
    // ========================================================

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const elapsed =
            clock.getElapsedTime();


        if (rocky) {

            // Floating sangat halus
            rocky.position.y =
                Math.sin(
                    elapsed * 1.2
                ) * 0.08;


            // Rotasi kecil
            rocky.rotation.y =
                Math.sin(
                    elapsed * 0.6
                ) * 0.10;

        }


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    // ========================================================
    // INITIAL ROCKY POSITION
    // ========================================================

    function getHeroPosition() {
        if (isMobile()) {
            return {
                left: '50%',
                top: '55%',
                scale: isSmallMobile() ? 1.7 : 2 // Naikkan dari 0.72 / 0.82
            };
        }
        return { left: '63%', top: '75%', scale: 1 };
    }


    const heroPosition =
        getHeroPosition();


    gsap.set(

        rockyContainer,

        {

            position: 'fixed',

            left:
                heroPosition.left,

            top:
                heroPosition.top,

            xPercent: -50,

            yPercent: -50,

            scale:
                heroPosition.scale,

            force3D: true

        }

    );


    // ========================================================
    // INITIAL HERO
    // ========================================================

    gsap.set(

        heroContent,

        {

            opacity: 1,

            xPercent: -50,

            y: 0,

            force3D: true

        }

    );


    gsap.set(

        rockyIntro,

        {

            opacity: 0,

            xPercent: -50,

            y: 30,

            scale: 0.95,

            force3D: true

        }

    );


    gsap.set(

        scrollIndicator,

        {

            opacity: 0.65

        }

    );


 function getRockyPositions() {
        const mobile = isMobile();
        const small = isSmallMobile();

        if (mobile) {
            return {
                // STORY: Pindah ke kanan atas untuk menyeimbangkan teks di kiri bawah
                story: {
                    left: '85%',
                    top: small ? '32%' : '33%',
                    scale: small ? 0.85 : 1.0 // Diperbesar drastis
                },
                // INFO: Mengintip di sebelah kanan judul "INFO"
                info: {
                    left: '82%',
                    top: small ? '7%' : '9%',
                    scale: small ? 0.75 : 0.85 
                },
                // GALERI: Menemani area thumbnail di bagian bawah layar
                galeri: {
                    left: '50%',
                    top: small ? '90%' : '100%', /* Dinaikkan sedikit agar tidak terpotong bawah */
                    scale: small ? 1.2 : 1.4    /* Diperbesar signifikan dari 0.8/0.9 */
                }
            };
        } 

        // ====================================================
        // DESKTOP (Jangan diubah)
        // ====================================================
        return {
            story: { left: '30%', top: '50%', scale: 1.4 },
            info: { left: '95%', top: '40%', scale: 0.75 },
            galeri: { left: '90%', top: '98%', scale: 1 }
        };
    }


    // ========================================================
    // GET POSITIONS
    // ========================================================

    let rockyPositions =
        getRockyPositions();


    // ========================================================
    // HERO SCROLL ANIMATION
    // ========================================================

    if (hero) {

        const heroTimeline =
            gsap.timeline({

                scrollTrigger: {

                    trigger: hero,

                    start: 'top top',

                    end: 'bottom bottom',

                    scrub: 2.5,

                    invalidateOnRefresh: true

                }

            });


        // ----------------------------------------------------
        // HERO CONTENT
        // ----------------------------------------------------

        heroTimeline.to(

            heroContent,

            {

                opacity: 0,

                y: -60,

                duration: 0.35,

                ease: 'power2.inOut'

            },

            0.05

        );


        // ----------------------------------------------------
        // ROCKY HERO → INTRO
        // ----------------------------------------------------

        // ----------------------------------------------------
        // ROCKY HERO → INTRO
        // ----------------------------------------------------

        heroTimeline.to(
            rockyContainer,
            {
                scale: isMobile() 
                    ? (isSmallMobile() ? 1.8 : 2.2) /* <-- Sesuaikan agar tetap besar saat teks Intro muncul */
                    : 1.8,
                duration: 0.5,
                ease: 'power2.inOut',
                force3D: true
            },
            0.10
        );


        // ----------------------------------------------------
        // ROCKY INTRO
        // ----------------------------------------------------

        heroTimeline.to(

            rockyIntro,

            {

                opacity: 1,

                y: 0,

                scale: 1,

                duration: 0.35,

                ease: 'power2.out',

                force3D: true

            },

            0.35

        );


        // ----------------------------------------------------
        // SCROLL INDICATOR
        // ----------------------------------------------------

        heroTimeline.to(

            scrollIndicator,

            {

                opacity: 0,

                duration: 0.15,

                ease: 'power2.out'

            },

            0.45

        );

    }


    // ========================================================
    // ROCKY → STORY
    // ========================================================

    if (
        story &&
        rockyContainer
    ) {

        rockyPositions =
            getRockyPositions();


        gsap.timeline({

            scrollTrigger: {

                trigger: story,

                start: 'top bottom',

                end: 'top top',

                scrub: 2.5,

                invalidateOnRefresh: true

            }

        })

        .to(

            rockyContainer,

            {

                left:
                    rockyPositions.story.left,

                top:
                    rockyPositions.story.top,

                scale:
                    rockyPositions.story.scale,

                xPercent: -50,

                yPercent: -50,

                duration: 1,

                ease: 'power2.inOut',

                force3D: true

            }

        );

    }


    // ========================================================
    // ROCKY INTRO FADE OUT
    // ========================================================

    if (
        rockyIntro &&
        story
    ) {

        gsap.to(

            rockyIntro,

            {

                opacity: 0,

                y: -25,

                scale: 0.95,

                ease: 'none',

                scrollTrigger: {

                    trigger: story,

                    start: 'top bottom',

                    end: 'top 70%',

                    scrub: 1.5,

                    invalidateOnRefresh: true

                }

            }

        );

    }


    // ========================================================
    // STORY CONTENT
    // ========================================================

    if (
        story &&
        storyItems.length > 0
    ) {

        // ----------------------------------------------------
        // INITIAL STATE
        // ----------------------------------------------------

        storyItems.forEach(

            (item, index) => {

                gsap.set(

                    item,

                    {

                        opacity:
                            index === 0
                                ? 1
                                : 0,

                        x:
                            index === 0
                                ? 0
                                : 60,

                        force3D: true

                    }

                );

            }

        );


        // ----------------------------------------------------
        // STORY TIMELINE
        // ----------------------------------------------------

        const storyTimeline =
            gsap.timeline({

                scrollTrigger: {

                    trigger: story,

                    start: 'top top',

                    end: 'bottom bottom',

                    scrub: 2.5,

                    invalidateOnRefresh: true

                }

            });


        const storyDuration =
            storyItems.length;


        // ----------------------------------------------------
        // STORY 1 → STORY 2
        // ----------------------------------------------------

        if (storyItems[1]) {

            storyTimeline

                .to(

                    storyItems[0],

                    {

                        opacity: 0,

                        x: -50,

                        duration: 0.8,

                        ease: 'power2.inOut'

                    }

                )

                .to(

                    storyItems[1],

                    {

                        opacity: 1,

                        x: 0,

                        duration: 0.8,

                        ease: 'power2.inOut'

                    },

                    '<'

                );

        }


        // ----------------------------------------------------
        // STORY 2 → STORY 3
        // ----------------------------------------------------

        if (storyItems[2]) {

            storyTimeline

                .to(

                    storyItems[1],

                    {

                        opacity: 0,

                        x: -50,

                        duration: 0.8,

                        ease: 'power2.inOut'

                    }

                )

                .to(

                    storyItems[2],

                    {

                        opacity: 1,

                        x: 0,

                        duration: 0.8,

                        ease: 'power2.inOut'

                    },

                    '<'

                );

        }

    }


    // ========================================================
    // CLOUD ANIMATION
    // ========================================================

    const clouds =
        document.querySelectorAll(
            '.story-clouds .cloud'
        );


    if (clouds.length > 0) {

        clouds.forEach(

            (cloud, index) => {

                gsap.to(

                    cloud,

                    {

                        x:
                            index % 2 === 0
                                ? 25
                                : -25,

                        y:
                            index === 1
                                ? -10
                                : 10,

                        duration:
                            4 + index,

                        ease:
                            'sine.inOut',

                        repeat: -1,

                        yoyo: true

                    }

                );

            }

        );

    }


    // ========================================================
    // ROCKY → INFO
    // ========================================================

    if (
        info &&
        rockyContainer
    ) {

        gsap.timeline({

            scrollTrigger: {

                trigger: info,

                start: 'top bottom',

                end: 'top 40%',

                scrub: 2.5,

                invalidateOnRefresh: true

            }

        })

        .to(

            rockyContainer,

            {

                left:
                    rockyPositions.info.left,

                top:
                    rockyPositions.info.top,

                scale:
                    rockyPositions.info.scale,

                xPercent: -50,

                yPercent: -50,

                duration: 1,

                ease: 'power2.inOut',

                force3D: true

            }

        );

    }


    // ========================================================
    // INFO INTERACTIVE
    // ========================================================

    const infoStats =
        document.querySelectorAll(
            '.info-stat'
        );

    const infoImage =
        document.querySelector(
            '#info-main-image'
        );

    const infoLabel =
        document.querySelector(
            '#info-label'
        );

    const infoTitle =
        document.querySelector(
            '#info-title'
        );

    const infoDescription =
        document.querySelector(
            '#info-description'
        );


    const infoData = {

        // ====================================================
        // 36 GOFSCONER
        // ====================================================

        gofsconer: {

            image:
                'assets/foto kelas.jpg',

            label:
                'ABOUT US',

            title:
                'MORE THAN<br>JUST A CLASS.',

            description:
                `Jadi anak-anak yang dicap unggulan juga ga mudah, lho. Walaupun ga ambis, harus tetap keliatan ambis biar ga keringgalan. Di samping ada tugas matematika empat kali seminggu, juga ada banyak dramanya. Ribut dikit, eh diungkit "anak kelas unggulan". Nakal dikit, "eh, anak IC kok gitu."`

        },


        // ====================================================
        // 3 YEARS
        // ====================================================

        years: {

            image:
                'assets/cerita1.jpg',

            label:
                'OUR JOURNEY',

            title:
                'THREE YEARS<br>TOGETHER.',

            description:
                `Walaupun mungkin bukan kelas unggulan yang dieskpektasikan guru-guru, kami tetap bangga untuk bisa terpilih sama-sama buat jadi bagian MIPA 1. Gimana engga? Kriteria apa sih yang gak ditemuin di Gofscone? Mulai dari yang basic-nya belajar dari subuh ke subuh, anak olim, hobi nulis, ngelukis yang coretannya aja cakep, hobi movie marathon anime/drakor, live music tiap jam kosong, anak paskib yang tiap pagi duluan dia daripada satpamnya, yang hobi masak apalagi buat pkwu, punya skill public speaking bagus, yang bakatnya ngelawak, keyboardist tiap upacara senin — belum lagi editor kebanggaan sekolah, sampai Miss Teen Hijab NTB 2022 cuma bisa ditemuin di kelas ini.`

        },


        // ====================================================
        // ENDLESS MEMORIES
        // ====================================================

        memories: {

            image:
                'assets/cerita3.jpg',

            label:
                'OUR MEMORIES',

            title:
                'ENDLESS<br>MEMORIES.',

            description:
                `Kalau mengesampingkan tugas, rasa tiga tahunnya terlalu singkat, apalagi kelas XI yang sama sekali ga pernah masuk full. Tetapi gapapa, karena cerita-ceritanya udah banyak, yang kalau dijabarin satu-satu ga akan selesai ketawa sampai lebaran nanti.Intinya, untuk jadi bagian dari Gofscone itu adalah privilege berharga sekali seumur hidup. Thank you sudah menjadi sahabat untuk berbagi cerita setiap harinya selama tiga tahun. Dan selamat sudah berhasil lulus dengan cita-cita yang sama-sama bisa kita doain.<br><br><strong>That was fun, wasn't it? See you again on top, folks!</strong>`

        }

    };


    // ========================================================
    // CHANGE INFO
    // ========================================================

    function changeInfo(type) {

        const data =
            infoData[type];


        if (!data) {

            return;

        }


        const elements = [

            infoImage,

            infoLabel,

            infoTitle,

            infoDescription

        ].filter(Boolean);


        // ----------------------------------------------------
        // FADE OUT
        // ----------------------------------------------------

        gsap.to(

            elements,

            {

                opacity: 0,

                y: 15,

                duration: 0.25,

                ease: 'power2.out',

                overwrite: true,

                onComplete: function () {

                    // ----------------------------------------
                    // UPDATE CONTENT
                    // ----------------------------------------

                    if (infoImage) {

                        infoImage.src =
                            data.image;

                    }


                    if (infoLabel) {

                        infoLabel.textContent =
                            data.label;

                    }


                    if (infoTitle) {

                        infoTitle.innerHTML =
                            data.title;

                    }


                    if (infoDescription) {

                        infoDescription.innerHTML =
                            data.description;

                    }


                    // ----------------------------------------
                    // FADE IN
                    // ----------------------------------------

                    gsap.to(

                        elements,

                        {

                            opacity: 1,

                            y: 0,

                            duration: 0.45,

                            ease: 'power2.out',

                            overwrite: true

                        }

                    );

                }

            }

        );


        // ----------------------------------------------------
        // ACTIVE BUTTON
        // ----------------------------------------------------

        infoStats.forEach(

            stat => {

                stat.classList.remove(
                    'active'
                );

            }

        );


        const selected =
            document.querySelector(

                `.info-stat[data-info="${type}"]`

            );


        if (selected) {

            selected.classList.add(
                'active'
            );

        }

    }


    // ========================================================
    // INFO BUTTON EVENTS
    // ========================================================

    infoStats.forEach(

        stat => {

            stat.addEventListener(

                'click',

                function () {

                    const type =
                        stat.getAttribute(
                            'data-info'
                        );

                    changeInfo(
                        type
                    );

                }

            );

        }

    );


    // ========================================================
    // DEFAULT INFO = 36 GOFSCONER
    // ========================================================

    if (
        infoStats.length > 0
    ) {

        infoStats.forEach(

            stat => {

                stat.classList.remove(
                    'active'
                );

            }

        );


        const defaultStat =
            document.querySelector(

                '.info-stat[data-info="gofsconer"]'

            );


        if (defaultStat) {

            defaultStat.classList.add(
                'active'
            );

        }

    }


    // ========================================================
    // ROCKY → GALERI
    // ========================================================

    if (
        galeri &&
        rockyContainer
    ) {

        rockyPositions =
            getRockyPositions();


        gsap.timeline({

            scrollTrigger: {

                trigger: galeri,

                start: 'top bottom',

                end: 'top 40%',

                scrub: 2.5,

                invalidateOnRefresh: true

            }

        })

        .to(

            rockyContainer,

            {

                left:
                    rockyPositions.galeri.left,

                top:
                    rockyPositions.galeri.top,

                scale:
                    rockyPositions.galeri.scale,

                xPercent: -50,

                yPercent: -50,

                duration: 1,

                ease: 'power2.inOut',

                force3D: true

            }

        );

    }


    // ========================================================
    // GALERI
    // ========================================================

    const galeriImage =
        document.querySelector(
            '.galeri-photo img'
        );

    const galeriThumbs =
        document.querySelectorAll(
            '.galeri-thumb'
        );


    // ========================================================
    // GALERI IMAGE CHANGE
    // ========================================================

    galeriThumbs.forEach(

        thumb => {

            thumb.addEventListener(

                'click',

                function () {

                    if (!galeriImage) {

                        return;

                    }


                    const image =
                        thumb.querySelector(
                            'img'
                        );


                    if (!image) {

                        return;

                    }


                    const newImage =
                        image.getAttribute(
                            'src'
                        );


                    if (!newImage) {

                        return;

                    }

                    thumb.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center' // Menggeser thumbnail yang diklik ke tengah layar
                    });
                    // ----------------------------------------
                    // CURRENT IMAGE
                    // ----------------------------------------

                    const currentImage =
                        galeriImage.getAttribute(
                            'src'
                        );


                    if (
                        currentImage ===
                        newImage
                    ) {

                        return;

                    }


                    // ----------------------------------------
                    // FADE OUT
                    // ----------------------------------------

                    gsap.to(

                        galeriImage,

                        {

                            opacity: 0,

                            scale: 1.04,

                            duration: 0.25,

                            ease: 'power2.out',

                            overwrite: true,

                            onComplete:
                                function () {

                                    // ----------------------------
                                    // CHANGE IMAGE
                                    // ----------------------------

                                    galeriImage.src =
                                        newImage;


                                    // ----------------------------
                                    // FADE IN
                                    // ----------------------------

                                    gsap.fromTo(

                                        galeriImage,

                                        {

                                            opacity: 0,

                                            scale: 1.04

                                        },

                                        {

                                            opacity: 1,

                                            scale: 1,

                                            duration: 0.55,

                                            ease: 'power2.out',

                                            overwrite: true

                                        }

                                    );

                                }

                        }

                    );


                    // ----------------------------------------
                    // ACTIVE THUMBNAIL
                    // ----------------------------------------

                    galeriThumbs.forEach(

                        item => {

                            item.classList.remove(
                                'active'
                            );

                        }

                    );


                    thumb.classList.add(
                        'active'
                    );

                }

            );

        }

    );


    // ========================================================
    // WINDOW RESIZE
    // ========================================================

    let resizeTimer;


    window.addEventListener(

        'resize',

        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(

                    function () {

                        resizeRenderer();


                        // ------------------------------------
                        // UPDATE POSITION DATA
                        // ------------------------------------

                        rockyPositions =
                            getRockyPositions();


                        // ------------------------------------
                        // REFRESH SCROLLTRIGGER
                        // ------------------------------------

                        ScrollTrigger.refresh();

                    },

                    200

                );

        }

    );


    // ========================================================
    // WINDOW LOAD
    // ========================================================

    window.addEventListener(

        'load',

        function () {

            resizeRenderer();

            ScrollTrigger.refresh();

        }

    );


    // ========================================================
    // FONT / IMAGE LOAD REFRESH
    // ========================================================

    setTimeout(

        function () {

            resizeRenderer();

            ScrollTrigger.refresh();

        },

        500

    );


    setTimeout(

        function () {

            ScrollTrigger.refresh();

        },

        1500

    );


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        'GOFSCONE main.js berhasil dijalankan.'
    );

}
