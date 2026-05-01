// myFunctions.js
// This file contains all shared JavaScript and jQuery functions for the website.

$(document).ready(function () {
  // Add a simple fade-in effect after page load.
  $("body").addClass("page-loaded");

  // Highlight the current navbar item.
  setActiveNavbarLink();

  // Load dark mode preference from localStorage.
  loadDarkModePreference();

  // Toggle dark mode.
  $("#darkModeToggle").on("click", function () {
    toggleDarkMode();
  });

  // Show or hide the scroll-to-top button.
  $(window).on("scroll", function () {
    toggleScrollTopButton();
  });

  // Scroll smoothly to the top of the page.
  $("#scrollTopBtn").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 450);
  });

  // Handle smooth navigation between local pages.
  $(".nav-page-link").on("click", function (event) {
    handleSmoothPageNavigation(event, this);
  });

  // Handle reservation modal action.
  $("#fakeReservationBtn").on("click", function () {
    handleReservation();
  });

  // Handle exit link action.
  $("#exitLink").on("click", function (event) {
    handleExitAction(event);
  });
});

// This function sets the active navbar link based on the current page.
function setActiveNavbarLink() {
  var currentPage = $("body").data("page");

  $(".custom-navbar .nav-link").removeClass("active");

  if (currentPage) {
    $('.custom-navbar .nav-link[data-nav="' + currentPage + '"]').addClass("active");
  }
}

// This function toggles dark mode and saves the preference.
function toggleDarkMode() {
  $("body").toggleClass("dark-mode");

  var isDarkMode = $("body").hasClass("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

  updateDarkModeButtonText();
}

// This function loads the saved dark mode preference.
function loadDarkModePreference() {
  var savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled") {
    $("body").addClass("dark-mode");
  }

  updateDarkModeButtonText();
}

// This function updates the dark mode button text.
function updateDarkModeButtonText() {
  if ($("body").hasClass("dark-mode")) {
    $("#darkModeToggle").text("الوضع النهاري");
  } else {
    $("#darkModeToggle").text("الوضع الليلي");
  }
}

// This function controls the scroll-to-top button visibility.
function toggleScrollTopButton() {
  if ($(window).scrollTop() > 260) {
    $("#scrollTopBtn").fadeIn(180);
  } else {
    $("#scrollTopBtn").fadeOut(180);
  }
}

// This function adds a short transition before moving to another local page.
function handleSmoothPageNavigation(event, linkElement) {
  var targetUrl = $(linkElement).attr("href");

  if (!targetUrl || targetUrl === "#" || targetUrl.startsWith("http")) {
    return;
  }

  event.preventDefault();

  $("body").removeClass("page-loaded");

  setTimeout(function () {
    window.location.href = targetUrl;
  }, 220);
}

// This function handles the reservation modal.
function handleReservation() {
  var reservationName = $("#reservationName").val().trim();
  var guestsCount = $("#reservationGuests").val();

  if (reservationName === "") {
    $("#reservationMessage").text("يرجى إدخال اسم صاحب الحجز.");
    return;
  }

  $("#reservationMessage").text("تم تسجيل طلب الحجز باسم " + reservationName + " لعدد " + guestsCount + " أشخاص.");
}

// This function provides a simple exit behavior for the website.
function handleExitAction(event) {
  event.preventDefault();

  var confirmExit = confirm("هل تريد العودة إلى الصفحة الرئيسية؟");

  if (confirmExit) {
    window.location.href = "home.html";
  }
}// Meals page initialization.
$(document).ready(function () {
  if ($("body").data("page") === "meals") {
    initializeMealsPage();
  }
});

// This function initializes all meals page events.
function initializeMealsPage() {
  loadMealCategoryPreference();

  $("#mealCategoryFilter").on("change", function () {
    saveMealCategoryPreference();
    filterMealsByCategory();
  });

  $(".details-toggle").on("change", function () {
    toggleMealDetails(this);
  });

  $("#continueBtn").on("click", function () {
    showOrderForm();
  });

  $("#clearMealsBtn").on("click", function () {
    clearSelectedMeals();
  });

  $("#hideFormBtn").on("click", function () {
    $("#orderFormSection").slideUp(250);
  });

  $("#orderForm").on("submit", function (event) {
    event.preventDefault();
    handleOrderSubmit();
  });
}

// This function saves the selected category in localStorage.
function saveMealCategoryPreference() {
  var selectedCategory = $("#mealCategoryFilter").val();
  localStorage.setItem("preferredMealCategory", selectedCategory);
}

// This function loads the saved category from localStorage.
function loadMealCategoryPreference() {
  var savedCategory = localStorage.getItem("preferredMealCategory");

  if (savedCategory) {
    $("#mealCategoryFilter").val(savedCategory);
  }

  filterMealsByCategory();
}

// This function filters meals by category.
function filterMealsByCategory() {
  var selectedCategory = $("#mealCategoryFilter").val();

  $(".meal-details-row").hide();
  $(".details-toggle").prop("checked", false);

  if (selectedCategory === "all") {
    $(".meal-row").show();
    return;
  }

  $(".meal-row").each(function () {
    var mealCategory = $(this).data("category");

    if (mealCategory === selectedCategory) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

// This function shows or hides a meal details row.
function toggleMealDetails(checkboxElement) {
  var targetSelector = $(checkboxElement).data("target");

  if ($(checkboxElement).is(":checked")) {
    $(targetSelector)
      .stop(true, true)
      .css("display", "table-row")
      .hide()
      .fadeIn(180);
  } else {
    $(targetSelector).stop(true, true).fadeOut(180);
  }
}

// This function returns all selected meals.
function getSelectedMeals() {
  var selectedMeals = [];

  $(".meal-select:checked").each(function () {
    var meal = {
      code: $(this).data("code"),
      name: $(this).data("name"),
      price: Number($(this).data("price"))
    };

    selectedMeals.push(meal);
  });

  return selectedMeals;
}

// This function shows the order form after selecting at least one meal.
function showOrderForm() {
  var selectedMeals = getSelectedMeals();

  if (selectedMeals.length === 0) {
    alert("يرجى اختيار وجبة واحدة على الأقل قبل متابعة الطلب.");
    return;
  }

  $("#orderFormSection").slideDown(260);

  $("html, body").animate({
    scrollTop: $("#orderFormSection").offset().top - 90
  }, 450);
}

// This function clears selected meals and hides the order form.
function clearSelectedMeals() {
  $(".meal-select").prop("checked", false);
  $("#orderFormSection").slideUp(250);
  $("#formErrors").hide().empty();
}

// This function handles order form submission.
function handleOrderSubmit() {
  var selectedMeals = getSelectedMeals();

  if (selectedMeals.length === 0) {
    alert("يرجى اختيار وجبة واحدة على الأقل.");
    return;
  }

  var validationErrors = validateOrderForm();

  if (validationErrors.length > 0) {
    showValidationErrors(validationErrors);
    return;
  }

  $("#formErrors").hide().empty();
  showInvoice(selectedMeals);
}

// This function validates order form inputs.
function validateOrderForm() {
  var errors = [];

  var customerName = $("#customerName").val().trim();
  var bankAccount = $("#bankAccount").val().trim();
  var orderDate = $("#orderDate").val().trim();
  var mobileNumber = $("#mobileNumber").val().trim();

  var fullNamePattern = /^[A-Za-z]+ [A-Za-z]+$/;
  var bankAccountPattern = /^[0-9]{6}$/;
  var mobilePattern = /^(093|094|095|096|098|099)[0-9]{7}$/;

  if (customerName !== "" && !fullNamePattern.test(customerName)) {
    errors.push("الاسم الكامل يجب أن يكون باللغة الإنكليزية فقط مع فراغ واحد بين الاسم والكنية. مثال: Ahmad Mohammad");
  }

  if (bankAccount === "") {
    errors.push("رقم الحساب المصرفي حقل إجباري.");
  } else if (!bankAccountPattern.test(bankAccount)) {
    errors.push("رقم الحساب المصرفي يجب أن يتكون من 6 أرقام فقط ويمكن أن يبدأ بصفر.");
  }

  if (orderDate !== "" && !isValidDate(orderDate)) {
    errors.push("تاريخ الطلب يجب أن يكون تاريخاً صحيحاً بالشكل yyyy-mm-dd. مثال: 2026-05-10");
  }

  if (mobileNumber !== "" && !mobilePattern.test(mobileNumber)) {
    errors.push("رقم الموبايل يجب أن يتكون من 10 خانات ويطابق أرقام Syriatel أو MTN مثل 0931234567.");
  }

  return errors;
}

// This function checks if a date value is valid and follows yyyy-mm-dd format.
function isValidDate(dateValue) {
  var datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  var match = dateValue.match(datePattern);

  if (!match) {
    return false;
  }

  var year = Number(match[1]);
  var month = Number(match[2]);
  var day = Number(match[3]);

  var dateObject = new Date(year, month - 1, day);

  return (
    dateObject.getFullYear() === year &&
    dateObject.getMonth() === month - 1 &&
    dateObject.getDate() === day
  );
}

// This function displays validation errors.
function showValidationErrors(errors) {
  var errorsHtml = "<ul>";

  for (var i = 0; i < errors.length; i++) {
    errorsHtml += "<li>" + errors[i] + "</li>";
  }

  errorsHtml += "</ul>";

  $("#formErrors").html(errorsHtml).slideDown(200);

  $("html, body").animate({
    scrollTop: $("#formErrors").offset().top - 120
  }, 350);
}

// This function displays the final invoice in a Bootstrap modal.
function showInvoice(selectedMeals) {
  var total = 0;
  var rowsHtml = "";

  for (var i = 0; i < selectedMeals.length; i++) {
    total += selectedMeals[i].price;

    rowsHtml += "<tr>";
    rowsHtml += "<td>" + selectedMeals[i].code + "</td>";
    rowsHtml += "<td>" + selectedMeals[i].name + "</td>";
    rowsHtml += "<td>" + formatCurrency(selectedMeals[i].price) + "</td>";
    rowsHtml += "</tr>";
  }

  var tax = total * 0.10;
  var netTotal = total - tax;

  var invoiceHtml = "";

  invoiceHtml += "<p class='mb-3'>شكراً لاختياركم مطعم عبق الشرق. هذا ملخص الوجبات المختارة:</p>";

  invoiceHtml += "<div class='table-responsive'>";
  invoiceHtml += "<table class='table table-bordered invoice-table align-middle'>";
  invoiceHtml += "<thead>";
  invoiceHtml += "<tr>";
  invoiceHtml += "<th>الرمز</th>";
  invoiceHtml += "<th>الوجبة</th>";
  invoiceHtml += "<th>السعر</th>";
  invoiceHtml += "</tr>";
  invoiceHtml += "</thead>";
  invoiceHtml += "<tbody>";
  invoiceHtml += rowsHtml;
  invoiceHtml += "</tbody>";
  invoiceHtml += "</table>";
  invoiceHtml += "</div>";

  invoiceHtml += "<div class='invoice-summary'>";
  invoiceHtml += "<p>المجموع الإجمالي: " + formatCurrency(total) + "</p>";
  invoiceHtml += "<p>قيمة الضريبة 10%: " + formatCurrency(tax) + "</p>";
  invoiceHtml += "<p>المبلغ الصافي بعد حسم الضريبة: " + formatCurrency(netTotal) + "</p>";
  invoiceHtml += "</div>";

  $("#invoiceContent").html(invoiceHtml);

  var invoiceModal = new bootstrap.Modal(document.getElementById("invoiceModal"));
  invoiceModal.show();
}

// This function formats numbers as Syrian pound values.
function formatCurrency(value) {
  return Math.round(value).toLocaleString("en-US") + " ل.س";
}