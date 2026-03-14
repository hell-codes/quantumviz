(function(){
  const links = document.querySelectorAll(".nav-links a");
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach(a => {
    if(a.getAttribute("href") === current) a.classList.add("active");
  });
})();

(function(){
  const burger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if(!burger || !navLinks) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
})();
