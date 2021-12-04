import React from 'react';

var page = 1;
var interval;
//Carousel Component
export default class Carousel extends React.Component {
  
    pages = [
        ["Safe Sex", "Educate Yourself. There are plenty of good self-help materials available for every type of sexual issue.", "/assets/mountain.png"],
        ["When to seek help", "If you experience anything abnormal after engaging in sexual activities, consider seeking help.", "/assets/love.png"],
        ["Always stay protected", "Whether it be wearing a condom, or taking birth control pills, there are many ways to protect yourself from sex.", "/assets/family.png"]
    ];


    //Class constructor
    constructor(props) {
        super(props);

        interval = setInterval(() => {
            this.nextPage();
        }, 5000);
    }

    //Move to the next page on click
    handleClick(e) {
        e.preventDefault();

        clearInterval(interval);
        interval = setInterval(() => {
            this.nextPage();
        }, 3000);
        
        this.nextPage();
    }

    //Function that handles moving to the next page of the carousel
    nextPage() {
        page = ((page) % (this.pages.length) + 1);

        for (var i = 1; i <= this.pages.length; i++) {
            document.getElementById("carousel-" + i).style.width = "0%";
        }

        document.getElementById("carousel-" + page).style.width = "100%";

    }

    render() {
        return (
            <div className="carousel" onClick={this.handleClick.bind(this)}>
                {this.pages.map((button, index) => (
                    <div className="au-body custom-body carousel-page" id={"carousel-" + (index + 1)} style={{ backgroundImage: `url(\"` + this.pages[index][2] + `\")` }}>
                        <div className="carousel-text">
                            <h1>{this.pages[index][0]}</h1>
                            <p>{ this.pages[index][1] }</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}