const footer = document.getElementsByTagName("footer")[0];

// add two select elements to the footer, one for selecting an element and one for changing its style
const selectElement = document.createElement("select");
const changeStyle = document.createElement("select");

// attach the elements to the footer
footer.appendChild(selectElement);
footer.appendChild(changeStyle);

// search the DOM for the header element and all article and section elements
// ignore the articles without h1 elements
const header = document.getElementsByTagName("header")[0];
const articles = Array.from(document.getElementsByTagName("article")).filter(article => article.getElementsByTagName("h1").length > 0);
const sections = document.getElementsByTagName("section");

// dynamically detect names of the articles and sections by looking at the heading text
const articleNames = [];
const sectionNames = [];

// dynamically detect names of the articles by looking at h1 text
for (const article of articles) {
    articleNames.push(article.getElementsByTagName("h1")[0].textContent);
}

// dynamically detect names of the sections by looking at h2 text, if it does not exist, use hyperlink text
for (const section of sections) {
    if (section.getElementsByTagName("h2")[0]) {
        sectionNames.push(section.getElementsByTagName("h2")[0].textContent);
    } else {
        sectionNames.push(section.getElementsByTagName("a")[0].textContent);
    }
}

// concat
const allNames = articleNames.concat(sectionNames);
allNames.unshift("Header");
allNames.push("Footer");

// dynamically generate options for the select element
for (const name of allNames) {
    const option = document.createElement("option");
    option.textContent = name;
    selectElement.appendChild(option);
}

// store element in variable when selecting it
let element = header;

selectElement.onchange = function () {
    // if the index is zero, it is the header
    if (selectElement.selectedIndex === 0) {
        element = header;
    } else if (selectElement.selectedIndex <= articles.length) {
        // it is an article
        element = articles[selectElement.selectedIndex - 1];
    } else if (selectElement.selectedIndex <= articles.length + sectionNames.length) {
        // it is a section
        element = sections[selectElement.selectedIndex - articles.length - 1];
    } else {
        // it is the footer
        element = footer;
    }
};

// add options to the changeStyle select element with 5 colors and 3 normal font sizes
const colors = ["red", "green", "blue", "yellow", "orange"];
const sizes = ["small", "medium", "large"];

// dynamically generate options for the changeStyle select element
for (const color of colors) {
    const option = document.createElement("option");
    option.textContent = color;
    changeStyle.appendChild(option);
}

for (const size of sizes) {
    const option = document.createElement("option");
    option.textContent = size;
    changeStyle.appendChild(option);
}

// edit the style of the selected element
changeStyle.onchange = function () {
    // check if the selection is a color
    if (changeStyle.selectedIndex < colors.length) {
        element.style.setProperty("color", colors[changeStyle.selectedIndex], "important");
    } else {
        element.style.setProperty("font-size", sizes[changeStyle.selectedIndex - colors.length], "important");
    }
};