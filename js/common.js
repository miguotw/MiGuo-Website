document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  const html = document.querySelector('html'),
    globalWrap = document.querySelector('.global-wrap'),
    body = document.querySelector('body'),
    menuToggle = document.querySelector(".hamburger"),
    menuList = document.querySelector(".main-nav"),
    searchOpenButton = document.querySelectorAll(".search-icon"),
    searchCloseIcon = document.querySelector(".search__close"),
    searchOverlay = document.querySelector(".search__overlay"),
    searchInput = document.querySelector(".search__text"),
    search = document.querySelector(".search"),
    toggleTheme = document.querySelector(".toggle-theme"),
    blogViewButton = document.querySelector(".blog__toggle"),
    splides = document.querySelector(".logos__slider"),
    tabButtons = document.querySelectorAll('.clients__tabs__control'),
    tabContents = document.querySelectorAll('.clients__tabs__item'),
    btnScrollToTop = document.querySelector(".top");


  /* =======================================================
  // Menu + Search + Theme Switcher + Blog List View
  ======================================================= */
  menuToggle.addEventListener("click", () => {
    menu();
  });

  searchOpenButton.forEach(button => {
    button.addEventListener("click", searchOpen);
  });

  searchCloseIcon.addEventListener("click", () => {
    searchClose();
  });

  searchOverlay.addEventListener("click", () => {
    searchClose();
  });

  if (blogViewButton) {
    blogViewButton.addEventListener("click", () => {
      viewToggle();
    });
  }


  // Menu
  function menu() {
    menuToggle.classList.toggle("is-open");
    menuList.classList.toggle("is-visible");
  }

  // Dropdown Menu
  document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();

      document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        if (menu !== toggle.nextElementSibling) {
          menu.classList.remove('is-visible');
        }
      });

      this.nextElementSibling.classList.toggle('is-visible');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav__item')) {
      document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        menu.classList.remove('is-visible');
      });
    }

    const isClickInsideMenu = e.target.closest('.main-nav');
    const isClickOnToggle = e.target.closest('.hamburger');

    if (!isClickInsideMenu && !isClickOnToggle) {
      menuList.classList.remove('is-visible');
      menuToggle.classList.remove('is-open');
    }
  });


  // Search
  function searchOpen() {
    search.classList.add("is-visible");
    body.classList.add("is-fixed");
    globalWrap.classList.add("is-active");
    menuToggle.classList.remove("is-open");
    menuList.classList.remove("is-visible");
    setTimeout(function () {
      searchInput.focus();
    }, 250);
  }

  function searchClose() {
    search.classList.remove("is-visible");
    body.classList.remove("is-fixed");
    globalWrap.classList.remove("is-active");
  }

  document.addEventListener('keydown', function(e){
    if (e.key == 'Escape') {
      searchClose();
    }
  });


  // Theme Switcher
  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      darkMode();
    });
  };

  function darkMode() {
    if (html.classList.contains('dark-mode')) {
      html.classList.remove('dark-mode');
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("dark");
    } else {
      html.classList.add('dark-mode');
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("dark", "");
    }
  };


  // Blog List View
  function viewToggle() {
    if (html.classList.contains('view-list')) {
      html.classList.remove('view-list');
      localStorage.removeItem("classView");
      document.documentElement.removeAttribute("list");
    } else {
      html.classList.add('view-list');
      localStorage.setItem("classView", "list");
      document.documentElement.setAttribute("list", "");
    }
  }


  /* ============================
  // Logos Slider
  ============================ */
  if (splides) {
    new Splide(splides, {
      direction: 'ltr',
      clones: 8,
      gap: 32,
      autoWidth: true,
      drag: true,
      arrows: false,
      pagination: false,
      type: 'loop',
      autoScroll: {
        autoStart: true,
        speed: 0.4,
        pauseOnHover: false,
        pauseOnFocus: false
      },
      intersection: {
        inView: {
          autoScroll: true,
        },
        outView: {
          autoScroll: false,
        }
      },
    }).mount(window.splide.Extensions);
  }


  /* ============================
  // Clients Tabs
  ============================ */
  if (tabButtons && tabContents) {
    tabButtons.forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const tabId = tabBtn.getAttribute('data-id');

        tabButtons.forEach((btn) => btn.classList.remove('active'));
        tabBtn.classList.add('active');

        tabContents.forEach((content) => {
          content.classList.remove('active');

          if (content.id === tabId) {
            content.classList.add('active');
          }
        });
      });
    });
  }


  /* ================================================================
  // Stop Animations During Window Resizing and Switching Theme Modes
  ================================================================ */
  let disableTransition;

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      stopAnimation();
    });
  }

  window.addEventListener("resize", () => {
    stopAnimation();
  });

  function stopAnimation() {
    document.body.classList.add("disable-animation");
    clearTimeout(disableTransition);
    disableTransition = setTimeout(() => {
      document.body.classList.remove("disable-animation");
    }, 100);
  };


  /* =======================
  // Responsive Videos
  ======================= */
  reframe(".post iframe:not(.reframe-off), .page iframe:not(.reframe-off)");


  /* =======================
  // LazyLoad Images
  ======================= */
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  })


  /* =======================
  // Zoom Image
  ======================= */
  const lightense = document.querySelector(".page__content img, .post__content img, .gallery__image img"),
  imageLink = document.querySelectorAll(".page__content a img, .post__content a img, .gallery__image a img");

  if (imageLink) {
    for (const i = 0; i < imageLink.length; i++) imageLink[i].parentNode.classList.add("image-link");
    for (const i = 0; i < imageLink.length; i++) imageLink[i].classList.add("no-lightense");
  };

  if (lightense) {
    Lightense(".page__content img:not(.no-lightense), .post__content img:not(.no-lightense), .gallery__image img:not(.no-lightense)", {
    padding: 60,
    offset: 30
    });
  };


  /* =================================
  // Accordion
  ================================= */
  const items = document.querySelectorAll(".faq__inner .faq__item");

  function toggleAccordion() {
    const itemToggle = this.getAttribute('data-name');

    if (itemToggle === 'closed') {
      this.setAttribute('data-name', 'open');
    } else {
      this.setAttribute('data-name', 'closed');
    }
  }

  items.forEach(item => {
    item.addEventListener('click', toggleAccordion);
    item.addEventListener('keydown', function(event) {
      if (event.keyCode === 13) {
        toggleAccordion.call(this);
      }
    });
  });


  /* =================================
  // Bookmarks
  ================================= */
  let bookmarksLoaded = false;

  function getBookmarks() {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
  }
  function saveBookmarks(bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  function updateClearButtonState() {
    const clearBtn = document.getElementById('clear-bookmarks') || document.querySelector('.clear-bookmarks');
    if (!clearBtn) return;

    const bookmarks = getBookmarks();
    if (bookmarks.length === 0) {
      clearBtn.classList.add('disabled');
      clearBtn.setAttribute('disabled', 'true');
    } else {
      clearBtn.classList.remove('disabled');
      clearBtn.removeAttribute('disabled');
    }
  }

  function createBookmarkItem(item) {
    const li = document.createElement("li");
    li.setAttribute('data-id', item.id);

    const imgHtml = item.image ? `<img src="${item.image}" alt="${item.title}" class="bookmark-thumb" loading="lazy">` : "";

    li.innerHTML = `
      ${imgHtml ? `
        <div class="bookmark-head">
          <div class="remove-bookmark" data-id="${item.id}" title="Remove bookmark">
            <i class="fa-solid fa-trash"></i>
          </div>
          <a href="${item.id}" class="bookmark-image">${imgHtml}</a>
        </div>
      ` : ""}
      <a href="${item.id}" class="bookmark-content">
        <span class="bookmark-date">${item.date}</span>
        <div class="bookmark-title">${item.title}</div>
        <div class="bookmark-desc">${item.desc || ""}</div>
      </a>
    `;
    return li;
  }

  function handleEmptyState() {
    const list = document.getElementById("bookmarks-list");
    const bookmarks = getBookmarks();
    const emptyMessage = document.querySelector('.empty-bookmarks-message');

    if (bookmarks.length === 0 && !emptyMessage) {
        list.innerHTML = `
          <div class="empty-bookmarks-message">
            <p>
              收藏你最喜歡的文章，只需點擊 <i class="fa-regular fa-bookmark"></i>按鈕儲存，以便後續查看。
            </p>
          </div>
        `;
    } else if (bookmarks.length > 0 && emptyMessage) {
        emptyMessage.remove();
    }
  }

  function renderAllBookmarks() {
    const bookmarks = getBookmarks();
    const list = document.getElementById("bookmarks-list");
    if (!list) return;

    list.innerHTML = "";
    if (bookmarks.length > 0) {
      bookmarks.forEach(item => {
        list.appendChild(createBookmarkItem(item));
      });
    } else {
      handleEmptyState();
    }
    bookmarksLoaded = true;
  }

  function updateUI() {
    const bookmarks = getBookmarks();
    const count = document.getElementById("bookmark-count");
    if (!count) return;

    if (bookmarks.length > 0) {
      count.textContent = bookmarks.length;
      count.classList.add("has-bookmarks");
    } else {
      count.textContent = "";
      count.classList.remove("has-bookmarks");
    }

    document.querySelectorAll(".bookmark-btn").forEach(btn => {
      const id = btn.dataset.id;
      const icon = btn.querySelector("i");
      if (bookmarks.find(b => b.id === id)) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        btn.classList.add("is-bookmarked");
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        btn.classList.remove("is-bookmarked");
      }
    });

    updateClearButtonState();
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".bookmark-btn")) {
      const btn = e.target.closest(".bookmark-btn");
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      const date = btn.dataset.date;
      const image = btn.dataset.image || "";

      let bookmarks = getBookmarks();
      const list = document.getElementById("bookmarks-list");
      const index = bookmarks.findIndex(b => b.id === id);

      if (index === -1) {
        const newItem = { id, title, desc, date, image };
        bookmarks.push(newItem);
        if (bookmarksLoaded) {
          const emptyMessage = document.querySelector('.empty-bookmarks-message');
          if (emptyMessage) {
              emptyMessage.remove();
          }
          list.appendChild(createBookmarkItem(newItem));
        }
      } else {
        bookmarks.splice(index, 1);
        if (bookmarksLoaded) {
          const listItem = document.querySelector(`#bookmarks-list li[data-id="${id}"]`);
          if (listItem) {
            listItem.remove();
          }
        }
      }

      saveBookmarks(bookmarks);
      updateUI();
      if (bookmarksLoaded) {
        handleEmptyState();
      }
    }

    if (e.target.closest(".remove-bookmark")) {
      const id = e.target.closest(".remove-bookmark").dataset.id;
      let bookmarks = getBookmarks().filter(b => b.id !== id);
      saveBookmarks(bookmarks);

      const listItem = document.querySelector(`#bookmarks-list li[data-id="${id}"]`);
      if (listItem) {
        listItem.remove();
      }

      updateUI();
      handleEmptyState();
    }

    if (e.target.closest("#bookmark-icon")) {
      document.getElementById("bookmark-sidebar").classList.add("open");
      document.querySelector(".bookmark-overlay").classList.add("show");
      body.classList.add("is-fixed");
      globalWrap.classList.add("is-active");

      if (!bookmarksLoaded) {
        renderAllBookmarks();
      }
    }

    if (e.target.closest("#close-sidebar")) {
      document.getElementById("bookmark-sidebar").classList.remove("open");
      document.querySelector(".bookmark-overlay").classList.remove("show");
      body.classList.remove("is-fixed");
      globalWrap.classList.remove("is-active");
    }

    if (e.target.classList.contains("bookmark-overlay")) {
      document.getElementById("bookmark-sidebar").classList.remove("open");
      document.querySelector(".bookmark-overlay").classList.remove("show");
      body.classList.remove("is-fixed");
      globalWrap.classList.remove("is-active");
    }

    if (e.target.closest("#clear-bookmarks")) {
      localStorage.removeItem("bookmarks");
      bookmarksLoaded = false;
      updateUI();
      handleEmptyState();
    }
  });
  updateUI();


  // =====================
  // Copy Code Button
  // =====================
  document.querySelectorAll('.post__content pre.highlight, .page__content pre.highlight')
  .forEach(function (pre) {
    const button = document.createElement('button');
    const copyText = 'Copy';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = copyText;
    button.addEventListener('click', function () {
      let code = pre.querySelector('code').innerText;
      try {
        code = code.trimEnd();
      } catch (e) {
        code = code.trim();
      }
      navigator.clipboard.writeText(code);
      button.innerText = 'Copied!';
      setTimeout(function () {
        button.blur();
        button.innerText = copyText;
      }, 2e3);
    });
    pre.appendChild(button);
  });


  // =====================
  // Load More Posts
  // =====================
  var load_posts_button = document.querySelector(".load-more-posts");

  load_posts_button&&load_posts_button.addEventListener("click",function(e){e.preventDefault();var t=load_posts_button.textContent;load_posts_button.classList.add("button--loading"),load_posts_button.textContent="Loading";var o=pagination_next_url.split("/page")[0]+"/page/"+pagination_next_page_number+"/";fetch(o).then(function(e){if(e.ok)return e.text()}).then(function(e){var t=document.createElement("div");t.innerHTML=e;for(var o=document.querySelector(".grid"),n=t.querySelectorAll(".grid__post"),a=0;a<n.length;a++)o.appendChild(n.item(a));new LazyLoad({elements_selector:".lazy"}),updateUI(),pagination_next_page_number++,pagination_next_page_number>pagination_available_pages_number&&(load_posts_button.style.display="none",document.querySelector(".load-more-complete").style.display="block")}).finally(function(){load_posts_button.classList.remove("button--loading"),load_posts_button.textContent=t})});


  /* =======================
  // Scroll Top Button
  ======================= */
  window.addEventListener("scroll", function () {
  window.scrollY > window.innerHeight ? btnScrollToTop.classList.add("is-active") : btnScrollToTop.classList.remove("is-active");
  });

  btnScrollToTop.addEventListener("click", function () {
    if (window.scrollY != 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  });

});