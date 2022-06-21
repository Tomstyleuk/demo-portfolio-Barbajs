const btn = [...document.querySelectorAll(".btn")];
const main = document.querySelector("main");
const logo = document.querySelector("#logo");
const firstImg = document.querySelector(".img_container");
const title = document.querySelector(".inner_item h1");
const client = document.querySelector(".client");
const service = document.querySelector(".service");
const firstBtn = document.querySelector(".btn");
const detailItems = document.querySelectorAll("[data-scene='detail']");
const menuBg = document.querySelector(".menu_bg");
const navOpen = document.querySelector(".open");
const navClose = document.querySelector(".close");
const navMenus = [...document.querySelectorAll(".menu_lists li")];
let detailImg;

/**
 * Loading animation
 */
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

/**
 * Hero image animation
 */
const tl = new TimelineMax();
const firstImgAnimate = () => {
  tl.fromTo(
    firstImg,
    1.8,
    { height: "0" },
    { height: "100vh", ease: Expo.easeInOut }
  )
    .fromTo(
      title,
      1.2,
      { opacity: "0", transform: "translateY(200px)" },
      { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
      "-=0.3"
    )
    .fromTo(
      client,
      1,
      { opacity: "0", transform: "translateY(100px)" },
      { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
      "-=0.5"
    )
    .fromTo(
      service,
      1,
      { opacity: "0", transform: "translateY(200px)" },
      { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
      "-=0.6"
    )
    .fromTo(
      firstBtn,
      0.8,
      { opacity: "0", transform: "translateY(200px)" },
      { opacity: "1", transform: "translateY(0)", ease: Power2.easeInOut },
      "-=0.6"
    );
};

logo.addEventListener("click", () => {
  if ((main.dataset.state = "detail")) {
    main.dataset.state = "home";
    detailImg.style.transformOrigin = "";
    detailImg.style.transition = "";
    detailImg.style.transform = "";
  }

  if (window.innerWidth > 1200) {
    firstImgAnimate();
  }
});

/**
 * Menu
 */
navOpen.addEventListener("click", () => {
  tl.fromTo(menuBg, 1.5, { width: "0" }, { width: "100%", ease: Expo.easeOut });
  navMenus.forEach((e) => {
    tl.fromTo(
      e,
      0.4,
      { opacity: "0", transform: "translateY(50px)" },
      { opacity: "1", transform: "translateY(0)", ease: Expo.easeOut },
      "-=0.1"
    );
  });
});

/**
 * Flip
 */
btn.forEach((i, index) => {
  i.addEventListener("click", (e) => {
    e.preventDefault();

    // FIRST
    let fullImgRect =
      i.parentNode.previousElementSibling.getBoundingClientRect();
    let smallImgRect;
    let detailTitle;
    let detailWrapper;
    let innerDetail;
    let about;
    let aboutTxt;

    main.dataset.state = main.dataset.state === "detail" ? "home" : "detail";

    requestAnimationFrame(() => {
      let parentItem = i.closest(".item").dataset.item;
      detailItems.forEach((d) => {
        d.classList.remove("matched");
        let detailItem = d.dataset.item;
        if (detailItem === parentItem) {
          d.classList.add("matched");

          // LAST
          let matchedEl = document.querySelector(".matched");
          smallImgRect = matchedEl
            .querySelector(".img_container")
            .getBoundingClientRect();
          detailImg = matchedEl.querySelector(".img_container");
          detailWrapper = matchedEl.querySelector(".detail_wrapper");
          detailTitle = document.querySelector(".matched h1");
          innerDetail = document.querySelector(".matched .inner_detail");
          about = document.querySelector(".matched .inner_detail > h2");
          aboutTxt = innerDetail.querySelector("p");

          // detail page
          if (main.dataset.state == "detail") {
            let nextProjectLink = matchedEl.querySelector(".next_link .top");
            let collectionWrapper = matchedEl.querySelector(
              ".collection_wrapper"
            );
            let itemsWrapper = matchedEl.querySelector(
              ".collection_wrapper .items"
            );
            let collectionTitle = matchedEl.querySelector(
              ".collection_wrapper h3"
            );

            window.addEventListener("scroll", () => {
              if (window.innerWidth < 768) {
                if (scrollY > 1750) {
                  collectionWrapper.style.background = "rgb(51, 51, 51)";
                  collectionWrapper.style.transition = "background 1s ease";
                } else {
                  collectionWrapper.style.background = "initial";
                }
              }

              // itemsWrapper.style.transform = `translateX(${scrollY / 5}px)`;
              collectionTitle.style.transform = `translateY(-${scrollY / 5}px)`;

              if (window.innerWidth < 1025) {
                itemsWrapper.style.transform = `none`;
                collectionTitle.style.transform = `translateY(${
                  scrollY / 5
                }px)`;
              }
            });

            nextProjectLink.addEventListener("click", (e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            });

            if (window.innerWidth < 1025) {
              if (main.dataset.state !== "home") {
                let labelOpen = document.querySelector(".open");
                labelOpen.classList.add("mobile_detail");
              } else {
                labelOpen.classList.remove("mobile_detail");
              }
            }
          }
        }
      });

      // INVERT
      const deltaX = fullImgRect.left - smallImgRect.left;
      const deltaY = fullImgRect.top - smallImgRect.top;
      const deltaW = fullImgRect.width / smallImgRect.width;
      const deltaH = fullImgRect.height / smallImgRect.height;

      detailImg.style.transformOrigin = `top left`;
      detailImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;

      // PLAY
      requestAnimationFrame(() => {
        detailImg.style.transition =
          "transform 1s cubic-bezier(0.5, 0, 0.5, 1)";
        detailImg.style.transform = "none";
        tl.fromTo(
          detailTitle,
          1.2,
          { opacity: "0", transform: "scale(0)" },
          {
            opacity: "1",
            width: "100%",
            transform: "scale(1)",
            ease: Expo.easeInOut,
          }
        )
          .fromTo(
            about,
            1,
            { opacity: "0", transform: "translateY(50px)" },
            { opacity: "1", transform: "translateY(0)", ease: Expo.easeInOut },
            "-=0.3"
          )
          .fromTo(
            aboutTxt,
            1,
            { opacity: "0", transform: "translateY(50px)" },
            { opacity: "1", transform: "translateY(0)", ease: Expo.easeInOut },
            "-=0.5"
          );
      });
    });
  });
});

/**
 * Detail page
 */
const items = document.querySelectorAll(".collection_wrapper .items figure");
const targets = document.querySelectorAll(".detail_img");
const options = {
  root: null,
  rootMargin: "0px 0px -10% 0px",
  threshold: 0,
};
const observer = new IntersectionObserver(eleInView, options);
targets.forEach((t) => {
  observer.observe(t);
});
items.forEach((i) => {
  observer.observe(i);
});

function eleInView(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in_view");
    }
  });
}
