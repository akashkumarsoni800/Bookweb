let buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {
  btn.addEventListener("click", function () {

    let card = this.parentElement;

    document.getElementById("p_name").innerText =
      card.querySelector(".b-name").innerText;

    document.getElementById("p_author").innerText =
      card.querySelector(".b-author").innerText;

    document.getElementById("p_publication").innerText =
      card.querySelector(".b-publication").innerText;

    document.getElementById("p_language").innerText =
      card.querySelector(".b-language").innerText;

    document.getElementById("p_volume").innerText =
      card.querySelector(".b-volume").innerText;

    document.getElementById("p_class").innerText =
      card.querySelector(".b-class").innerText;

    document.getElementById("p_price").innerText =
      card.querySelector(".b-price").innerText;

    document.getElementById("popup").style.display = "block";
  });
});

function closePopup() {
  document.getElementById("popup").style.display = "none";
}



document.getElementById("menu-toggle").onclick = () => {
    document.getElementById("menu-list").classList.toggle("show");
};
