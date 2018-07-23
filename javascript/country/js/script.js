//Object Constructor
function countryTemplate (backgroundColor, color, flag, name, description) {
    this.backgroundColor = backgroundColor;
    this.color = color;
    this.flag = flag;
    this.name = name;
    this.description =  description;
};
//variable Declaration
var countryName = [];
var visible = [];
var count = 0;

//Description of countries
var argentinaDesc =  "Argentina is a massive South American nation with terrain encompassing Andes mountains, glacial lakes and Pampas grassland,"+
        " the traditional grazing ground of its famed beef cattle. The country is famous for tango dance and music. Its big, cosmopolitan capital,"+
        " Buenos Aires, is centered on the Plaza de Mayo, lined with stately 19th-century buildings including Casa Rosada, the iconic, balconied "+
        "presidential palace.";

var canadaDesc = "Canada is a North American country stretching from the U.S. in the south to the Arctic Circle in the north. Major cities include "+
        "massive Toronto, west coast film centre Vancouver, French-speaking Montréal and Québec City, and capital city Ottawa. Canada's vast swaths of"+
        " wilderness include lake-filled Banff National Park in the Rocky Mountains. It's also home to Niagara Falls, a famous group of massive waterfalls.";

var chinaDesc = "China is a populous nation in East Asia whose vast landscape encompasses grassland, desert, mountains, lakes, rivers and more than"+
        " 14,000km of coastline. Capital Beijing mixes modern architecture with historic sites such as the Forbidden City palace complex and Tiananmen "+
        "Square. Shanghai is a skyscraper-studded global financial center. The iconic Great Wall of China runs east-west across the country's north.";

var indiaDesc =  "India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back"+
        " 5 millennia. In the north, Mughal Empire landmarks include Delhi’s Red Fort complex and massive Jama Masjid mosque, plus Agra’s iconic Taj Mahal"+
        " mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre and base for Himalayan trekking.";

var pakistanDesc = "Pakistan, officially the Islamic Republic of Pakistan, is a country in South Asia. It is the fifth-most populous country with a "+
        "population  exceeding 212,742,631 people. In area, it is the 33rd-largest country, spanning 881,913 square kilometres";

var spainDesc = "Spain, a country on Europe’s Iberian Peninsula, includes 17 autonomous regions with diverse geography and cultures. Capital city"+
        " Madrid is home to the Royal Palace and Prado museum, housing works by European masters. Segovia has a medieval castle (the Alcázar) and an intact"+
        " Roman aqueduct. Catalonia’s capital, Barcelona, is defined by Antoni Gaudí’s whimsical modernist landmarks like the Sagrada Família church.";

var usaDesc = "The U.S. is a country of 50 states covering a vast swath of North America, with Alaska in the northwest and Hawaii extending the "+
        "nation’s presence into the Pacific Ocean. Major Atlantic Coast cities are New York, a global finance and culture center, and capital Washington, "+
        "DC. Midwestern metropolis Chicago is known for influential architecture and on the west coast, Los Angeles' Hollywood is famed for filmmaking.";

//Inserting in array
countryName[0] = new countryTemplate("#90CAF9", "#000000", "argentina", "argentina", argentinaDesc);
countryName[1] = new countryTemplate("#EF5350", "#000000", "canada", "canada", canadaDesc);
countryName[2] = new countryTemplate("#EE3935", "#FFFFFF", "china", "china", chinaDesc);
countryName[3] = new countryTemplate("#0288D1", "#FFFFFF", "india", "india", indiaDesc);
countryName[4] = new countryTemplate("#1B5E20", "#FFFFFF", "pakistan", "pakistan", pakistanDesc);
countryName[5] = new countryTemplate("#FDD835", "#000000", "spain", "spain", spainDesc);
countryName[6] = new countryTemplate("#C62828", "#FFFFFF", "usa", "usa", usaDesc);

//Call by default to insert first element
addCountry(0);
//Function to insert more countries
function addCountry(id) {
    if(count > countryName.length-1) {
        alert("Sorry");
    }
    else {
        var block = "<div class='country' id='count-" + count + "'>" +
                        "<div class='cross' onclick='closeThis(" + count + ")'>x</div>" +
                        "<img src='images/" + countryName[count].flag + ".png' alt=" + countryName[count].flag + " class='country-flag' >" +
                        "<h1 class='country-name'>" + countryName[count].name + "</h1>" +
                        "<p class='country-desc'>" +
                            countryName[count].description +
                        "</p>" +
                        "<button class='add-more' onclick='addCountry(" + count + ")' id='btn-" + count + "'>Show Country</button>" +
                    "</div>";
        document.getElementById("container").innerHTML += block;

        document.getElementsByClassName("country")[count].style.backgroundColor = countryName[count].backgroundColor;
        document.getElementsByClassName("country")[count].style.color = countryName[count].color;
        if(count != 0) {
             document.getElementById("btn-" + (id)).disabled = true;
        }
        visible.push(count);
        count++;
    }
}

function closeThis(id) {
    document.getElementById("count-" + id).style.display = "none";
    visible.splice(visible.indexOf(id),1);
    var last= visible[visible.length-1];
    document.getElementById("btn-" + last).disabled = false;
}
