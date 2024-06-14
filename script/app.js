const btn = [...document.querySelectorAll(".btn")];
const main = document.querySelector("main");
const logo = document.getElementById("logo");
const firstImg = document.querySelector(".img_container");
const title = document.querySelector(".inner_item h1");
const client = document.querySelector(".client");
const service = document.querySelector(".service");
const firstBtn = document.querySelector(".btn");
const menuBg = document.querySelector(".menu_bg");
const navOpen = document.querySelector(".open");
const navClose = document.querySelector(".close");
const navMenus = [...document.querySelectorAll(".menu_lists li")];
const loadImg = document.querySelector('.load-img');
const initialSrc = loadImg.getAttribute('src');
const homeLink = loadImg.getAttribute('.home_link');

const lenis = new Lenis(
  {
    // lerp: 0.15,
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1,
  }
)

let lenisScroll
function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const triggerHeight = windowHeight * 0.4;
  return (
    rect.top >= -triggerHeight &&
    rect.bottom <= (windowHeight + triggerHeight)
  );
}


/**
 * reveal loading text and fadeout text
 */
let loadingText = document.querySelector('.txt');

function revealingText() {
  let strText = loadingText.textContent;
  let splitText = strText.split("");
  loadingText.textContent = "";

  for (let i = 0; i < splitText.length; i++) {
    loadingText.innerHTML += "<span class='reveal_txt'>" + splitText[i] + "</span>";
  }

  let txtElement = document.querySelector('.txt');
  if (txtElement.querySelector('.reveal_txt')) {
    txtElement.style.opacity = 1;
  }


  let char = 0;

  function animate() {
    const spans = loadingText.querySelectorAll(".reveal_txt");
    const span = spans[char];

    setTimeout(() => {
      span.classList.add("Fadein");
    }, char * 35);
    char++;

    if (char < splitText.length) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(complete, 1500);
    }
  }

  requestAnimationFrame(animate);

  function complete() {
    const spans = loadingText.querySelectorAll(".reveal_txt");

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const delay = i * 45; // Adjust the delay duration as needed

      setTimeout(() => {
        span.classList.add("Fadeout");
      }, delay);
    }
  }
}

function delay(n, callback) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done(callback);
    }, n);
  });
}

function pageTransition() {
  const tl = gsap.timeline();

  tl.to(".loading-screen", {
    duration: 1.4,
    opacity: 1,
    // width: "100%", // left to right
    // left: "0%", // left to right
    height: "100%", // top to bottom
    top: "0%", // top to bottom
    ease: "Expo.easeInOut",
  })

  /**
   * Loadgin Split texts
   */
  setTimeout(() => {
    revealingText()
  }, 700);

  /**
  * Loading Img
  */
  tl.to(".load-img", {
    duration: 1,
    opacity: 1,
    // top: '50%',
    ease: "Expo.easeInOut",
  }, '-=0.5')


  tl.to(".loading-screen", {
    duration: 1.4,
    // width: "100%", // left to right
    // left: "100%", // left to right
    height: "100%", // top to bottom
    top: "100%", // top to bottom
    ease: "Expo.easeInOut",
    delay: 0.3,
  }, '+=1')

  tl.set(".load-img", { opacity: "0" }, '-=1')
  tl.set(".loading-screen", { top: "-100%" });
  // tl.set(".loading-screen", { left: "-100%" });
}

function backToPageTop() {
  delay(1000);

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

function setupObserver() {
  const BlurImages = document.querySelectorAll(".img-wrapper");
  const options = {
    root: null,
    rootMargin: "20% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inView");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  BlurImages.forEach(image => {
    observer.observe(image);
  });
}

function clickLogoLoadingImage() {
  logo.addEventListener('click', function (e) {
    e.preventDefault();
    loadImg.setAttribute('src', initialSrc);
  });
}


/**
 * Nav Animation
 */
function initNavAnimation() {
  const toggleButton = document.querySelector(".burger");
  const menuLinks = document.querySelectorAll(".menu-item-link");
  const overlay = document.querySelector(".overlay");
  const overlayMenu = document.querySelector(".overlay-menu");
  const main = document.querySelector("main");
  let isOpen = false;

  const timeline = gsap.timeline({
    paused: true,
    onStart: function () {
      overlay.style.zIndex = "1";
      overlayMenu.style.zIndex = "2";
    },
  });

  timeline.to(".block", {
    duration: 1,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    stagger: 0.055,
    ease: "power3.inOut"
  })

  timeline.to(".menu-title, .menu-item", {
    duration: 0.25,
    opacity: 1,
    stagger: 0.05
  }, "-=0.5");

  toggleButton.addEventListener("click", function () {
    if (isOpen) {
      timeline.reverse();
      timeline.eventCallback("onReverseComplete", function () {
        setTimeout(() => {
          lenis.start()
          main.style.zIndex = "2";
          overlay.style.zIndex = "-1";
          overlayMenu.style.zIndex = "-1";
        }, 100);
      });
    } else {
      timeline.play();
    }

    isOpen = !isOpen;
    setTimeout(() => {
      lenis.stop()
      main.style.zIndex = "0";
      overlay.style.zIndex = "1";
      overlayMenu.style.zIndex = "2";
    }, 800);
  });

  menuLinks.forEach(link => {
    const anchor = link.querySelector('a');

    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      if (isOpen) {
        timeline.reverse();
        timeline.eventCallback("onReverseComplete", function () {
          setTimeout(() => {
            lenis.start()
            main.style.zIndex = "2";
            overlay.style.zIndex = "-1";
            overlayMenu.style.zIndex = "-1";
          }, 900);
        });

        isOpen = false;
        toggleButton.classList.remove('active');

        const imgSrc = anchor.dataset.img;
        const loadingImg = document.querySelector('.load-img');
        if (imgSrc) {
          loadingImg.setAttribute('src', imgSrc);
        }
      }
    });
  });
}
window.addEventListener("load", initNavAnimation);


/******************
Barba
******************/
barba.init({
  sync: true,
  preventRunning: true,
  transitions: [
    {
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(1000);
        await delay(backToPageTop());
        done();
      },

      async enter(data) {
        setupObserver();
        initNavAnimation();

        /******************
         * Click "Read more"
        *******************/
        let btns = document.querySelectorAll('.btn a');
        let logo = document.querySelector('#logo a');
        let loadImg = document.querySelector('.load-img');

        for (let i = 0; i < btns.length; i++) {
          btns[i].addEventListener('click', function (e) {
            e.preventDefault();
            let imgSrc = this.closest('.item').querySelector('.img_container img').getAttribute('src');

            let loadImg = document.querySelector('.load-img');
            if (loadImg.getAttribute('src') === initialSrc) {
              loadImg.setAttribute('src', imgSrc);
            } else if (loadImg.getAttribute('src') === imgSrc) {
              loadImg.setAttribute('src', initialSrc);
            }
          });
        }

        clickLogoLoadingImage()
        backToPageTop()
      },

      async once(data) {
        setupObserver();
        initNavAnimation();


        /******************
        * Click "Read more"
        *******************/
        let btns = document.querySelectorAll('.btn a');
        let logo = document.querySelector('#logo a');
        let loadImg = document.querySelector('.load-img');

        for (let i = 0; i < btns.length; i++) {
          btns[i].addEventListener('click', function (e) {
            e.preventDefault();
            let imgSrc = this.closest('.item').querySelector('.img_container img').getAttribute('src');

            if (loadImg.getAttribute('src') === initialSrc) {
              loadImg.setAttribute('src', imgSrc);
            } else if (loadImg.getAttribute('src') === imgSrc) {
              loadImg.setAttribute('src', initialSrc);
            }
          });
        }

        clickLogoLoadingImage()
      },
    },
  ],
});


/**
 * Loading animation only in home page
 */
const homePage = document.getElementById('home');

if (homePage) {
  if (window.innerWidth > 1025) {
    const elem = document.querySelector('.item[data-item="one"] img');

    const callback = () => {
      document.querySelector("body").classList.remove("hide");
      document.querySelector(".loading-animation").classList.add("loaded");
      setTimeout(firstImgAnimate(), 500);
    };
    imagesLoaded(elem, callback);
  } else if (window.innerWidth < 1024) {
    document.querySelector("body").classList.remove("hide");
    document.querySelector(".loading-animation").classList.add("loaded");
  }
}

/**
 * Hero image animation
 */
const tl = gsap.timeline();
const firstImgAnimate = () => {
  if (!localStorage.getItem('visited')) {
    localStorage.setItem('visited', true);
    tl.fromTo(
      firstImg,
      2,
      { height: "0" },
      { height: "100vh", ease: Expo.easeInOut }
    )
      .fromTo(
        title,
        1.2,
        { opacity: "0", transform: "translateY(200px)" },
        { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
        "-=0.8"
      )
      .fromTo(
        client,
        1,
        { opacity: "0", transform: "translateY(100px)" },
        { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
        "-=0.7"
      )
      .fromTo(
        service,
        1,
        { opacity: "0", transform: "translateY(200px)" },
        { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
        "-=0.75"
      )
      .fromTo(
        firstBtn,
        1,
        { opacity: "0", transform: "translateY(200px)" },
        { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
        "-=0.78"
      );
  }
};


lenis.on('scroll', (scroll) => {
  lenisScroll = scroll.animatedScroll
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
