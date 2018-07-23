var count=0;
function openNav(){
    var nav=document.getElementById("navigation-icon");
    if(count%2==0){
        document.getElementById("responsive-nav-list").style.display = "block";
        count++;
    }
    else{
        document.getElementById("responsive-nav-list").style.display = "none";

        count=0;
    }
}
