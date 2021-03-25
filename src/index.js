import Swiper from 'swiper';
import { TweenMax, Back } from "gsap";
import mobile from 'is-mobile';
import 'swiper/swiper-bundle.css';
import './scss/styles.scss';
import "lazysizes";

// updating view with swiper content:

const contentSwiperSliser = `<div class="arrow-cursor">
<svg class="arrow-cursor__icon" viewBox="0 0 117.25 86.75">
  <path class="arrow-cursor__path" d="M111.45,42.5,74.65,5.7l-9.9,9.9,20.6,20.6H6.45v14h78.9L64.75,70.8l9.9,9.9,36.8-36.8A1,1,0,0,0,111.45,42.5Z"/>
</svg>
</div>
<div class="swiper-container">
<div class="swiper-wrapper">
    %%IMAGESLIST%%
</div>
<div class="swiper-button-prev"></div>
<div class="swiper-button-next"></div>
</div>`;

const selector = ".simple-swiper-slider";

class Slider {
    constructor() {
      const list = document.querySelectorAll(selector);
      list.forEach((item) => {
        const innerImages = item.querySelectorAll('.img-list img');
        var listSlides = '';
        innerImages.forEach((img) => {
          listSlides += '<div class="swiper-slide swiper-slide--wide"> \
          <img class="' + img.className + '" src="' + img.src + '" data-src="' + img.dataset.src + '" alt="' + img.alt + '"> \
        </div>'
        })
        let newInnerHTML = contentSwiperSliser.replace('%%IMAGESLIST%%', listSlides);

        item.innerHTML = newInnerHTML;
      });
      // window.lazySizes.init();

      this.init();
    }

    
    init() {
      this.cursor = document.querySelector(".arrow-cursor");
      this.cursorIcon = document.querySelector(".arrow-cursor__icon");
      this.cursorBox = this.cursor.getBoundingClientRect();
      this.easing = Back.easeOut.config(1.7);
      this.animationDuration = 0.3;
      this.cursorSide = null; // will be "left" or "right"
      this.cursorInsideSwiper = false;

      // initial cursor styling
      TweenMax.to(this.cursorIcon, 0, {
        rotation: -135,
        opacity: 0,
        scale: 0.5
      });

      TweenMax.to(this.cursorIcon, 0, {
        rotation: -135,
        opacity: 0,
        scale: 0.5
      });
  
      document.addEventListener("mousemove", e => {
        this.clientX = e.clientX;
        this.clientY = e.clientY;
      });
  
      const render = () => {
        TweenMax.set(this.cursor, {
          x: this.clientX,
          y: this.clientY
        });
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
  
      // mouseenter
      const onSwiperMouseEnter = e => {
        if (!mobile()) {
          this.swiperBox = e.target.getBoundingClientRect();
    
          if (!this.clientX) this.clientX = e.clientX;
          if (!this.clientY) this.clientY = e.clientY;
    
          let startRotation;
          if (this.clientY < this.swiperBox.top + this.swiperBox.height / 2) {
            startRotation = -135;
          } else {
            startRotation = this.clientX > window.innerWidth / 2 ? 135 : -315;
          }
          TweenMax.set(this.cursorIcon, {
            rotation: startRotation
          });
    
          this.cursorSide = this.clientX > window.innerWidth / 2 ? "right" : "left";
    
          TweenMax.to(this.cursorIcon, this.animationDuration, {
            rotation: this.cursorSide === "right" ? 0 : -180,
            scale: 1,
            opacity: 1,
            ease: this.easing
          });
        }
      };
  
      // mouseLeave
      const onSwiperMouseLeave = e => {
        this.swiperBox = e.target.getBoundingClientRect();
  
        let outRotation = 0;
        if (this.clientY < this.swiperBox.top + this.swiperBox.height / 2) {
          outRotation = this.cursorSide === "right" ? -135 : -45;
        } else {
          outRotation = this.cursorSide === "right" ? 135 : -315;
        }
     
        TweenMax.to(this.cursorIcon, this.animationDuration, {
          rotation: outRotation,
          opacity: 0,
          scale: 0.3
        });
  
        this.cursorSide = null;
        this.cursorInsideSwiper = false;
      };
  
      // move cursor from left to right or right to left inside the Swiper
      const onSwitchSwiperSides = () => {

          if (this.cursorInsideSwiper) {
            TweenMax.to(this.cursorIcon, this.animationDuration, {
              rotation: this.cursorSide === "right" ? -180 : 0,
              ease: this.easing
            });
            this.cursorSide = this.cursorSide === "left" ? "right" : "left";
          }
    
          if (!this.cursorInsideSwiper) {
            this.cursorInsideSwiper = true;
          }
      };
  
      const swiperContainer = document.querySelector(".swiper-container");
      swiperContainer.addEventListener("mouseenter", onSwiperMouseEnter);
      swiperContainer.addEventListener("mouseleave", onSwiperMouseLeave);
  
      const swiperButtonPrev = document.querySelector(".swiper-button-prev");
      const swiperButtonNext = document.querySelector(".swiper-button-next");
      swiperButtonPrev.addEventListener("mouseenter", onSwitchSwiperSides);
      swiperButtonNext.addEventListener("mouseenter", onSwitchSwiperSides);
      swiperButtonPrev.addEventListener("click", (evt)=>{
         this.swiper.slidePrev();
         // console.log(evt);
      });
      swiperButtonNext.addEventListener("click", (evt)=>{
        this.swiper.slideNext();
        // console.log(evt);
      });
    }

    initSwiper() {
        // const { Swiper } = window;
        this.swiper = new Swiper(".swiper-container", {
          loop: true,
          slidesPerView: "auto",
          spaceBetween: 40,
          centeredSlides: true,
          allowSlideNext: true,
          allowSlidePrev: true,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          }
        });

        
        this.swiper.on("touchMove", e => {
          const { clientX, clientY } = e;
          this.clientX = clientX;
          this.clientY = clientY;
    
          this.cursorSide = this.clientX > window.innerWidth / 2 ? "right" : "left";
    
          TweenMax.to(this.cursorIcon, this.animationDuration, {
            rotation: this.cursorSide === "right" ? 0 : -180,
            ease: this.easing
          });
        });
    
        this.bumpCursorTween = TweenMax.to(this.cursor, 0.1, {
          scale: 0.85,
          onComplete: () => {
            TweenMax.to(this.cursor, 0.2, {
              scale: 1,
              ease: this.easing
            });
          },
          paused: true
        });
    
        this.swiper.on("slideChange", () => {
          this.bumpCursorTween.play();
        });
    }

  
}


setTimeout(() => {
  let slider = new Slider();
  slider.initSwiper();
}, 500);
