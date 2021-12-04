import React from 'react';
import AUcard, { AUcardInner, AUcardTitle, AUcardLink } from '../pancake/react/card';
import { AUcallout } from '../pancake/react/callout';
import { IoIosDesktop } from "react-icons/io";
import { ImLocation } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { BsDropletFill } from "react-icons/bs"
import ToggleSwitch from './ToggleSwitch'
import Quiz from './quiz'
import CardV2 from './CardV2';
import Carousel from './Carousel';


//Home Page
export default function Home() {
  return (
    <div id="homeContent">
      
      <Carousel />

      <div className="au-body custom-body">
        <ToggleSwitch items={[
            ["Quiz", "page-1-div"],
            ["Risk Calculator", "page-2-div"],
        ]}/>
        <div id="page-1-div">
          <AUcallout title="Take the quiz" className="AUcallout">
            <p> Use our short quiz to find information relevant to you. All information provided will be kept strictly confidential. </p>
            <br />
            <strong><p> Your answers are confidential and do not leave your computer </p></strong>
          </AUcallout>
          <Quiz type="quiz" />
        </div>
        <div id="page-2-div" style={{display: "none"}}>
            <AUcallout title="Got Symptoms?" className="AUcallout">
              <p>
                Most STIs don't have symptoms and you might never know you have one. But if you do get symptoms, 
                the most common are pain when peeing, sores or blisters, lumps, and dischage from your vagina or penis.
              </p>
              <p>
                If you think you have symptoms of an STI please use our risk calculator. We'll ask you a few 
                questions about your recent sexual activity and at the end we'll tell you what to do next.
              </p>
            </AUcallout>
            <Quiz type="risk" />
        </div>
      </div>

      <div className="au-body au-body--alt custom-body">
        <h1><bold> Outside Resources </bold></h1>
        <br/>
        <div className="card-row">
          <CardV2 id="1" 
            title="Stop the Rise"
            text = "Sexually transmissable infections (STIs) are common and increasing in Australia." 
            ratio={298/148} 
            link="https://stoptherise.initiatives.qld.gov.au/"
            image="/assets/stop-the-rise.png"
          />
          <CardV2 id="2" 
            title="13Health Webtest"
            text="Order a free Chlamydia and Gonorrhoea test online." 
            ratio={298/148}
            link="https://www.qld.gov.au/health/staying-healthy/sexual-health/chlamydia-test/order"
            image="/assets/13health-webtest.jpg"
          />
          <CardV2 id="3" 
            title = "Wrapped'N Ready"
            text="Free condom distribution program run by the Queensland AIDS Council (QuAC)." 
            ratio={298/148}
            link="https://quac.org.au/wrapped-n-ready/"
            image="/assets/wrapped_img.png"
          />
          <CardV2 id="4" 
            title="True"
            text="True is the state's leading provider of reproductive sexual health services." 
            ratio={298/148}
            link="https://www.true.org.au/"
            image="/assets/true_logo.png"
            />
          <CardV2 id="5" 
            title="Reach Out"
            text="A safe space for young people to discuss topics related to their health and wellbeing, and to seek guidance on getting appropriate help." 
            ratio={298/148} 
            link="https://au.reachout.com/articles/how-to-get-a-sexual-health-check"
            image="/assets/reach_out.png"
          />
          <CardV2 id="6" 
            title="myDr"
            text="The impacts of sex and the ageing process." 
            ratio={298/148} 
            link="https://www.mydr.com.au/sex-and-the-ageing-process/"
            image="/assets/myDr.png"
          />
          <CardV2 id="7" 
            title="1800RESPECT"
            text="National sexual assault, domestic family violence counselling service." 
            ratio={298/148} 
            link="https://www.1800respect.org.au/"
            image="/assets/1800Respect.png"
          />
          <CardV2 id="8" 
            title="TuneInNotOut"
            text="Your one-stop shop for information on life's challenges!" 
            ratio={298/148} 
            link="https://tuneinnotout.com/sex-and-sexual-health/sex-and-consent/"
            image="/assets/Tino.png"
          />
        </div>
      </div>
      <div className="au-body custom-body">
        <h1><bold> How can we help? </bold></h1>
        <div className="equidistance">
          <div className="quarterSplit">
            <AUcard className="au-body custom-card" clickable shadow style={{borderTop: "solid red 5px"}}>
              <IoIosDesktop id="dashboard"/>
                <AUcardInner>
                  <AUcardTitle level="3"><AUcardLink link="/faqs" text="Popular questions about Sexual Health" /></AUcardTitle>
                    <p>See information that could be directly relevant to you.</p>
                  </AUcardInner>
            </AUcard>
          </div>
          <div className="quarterSplit">
            <AUcard className="au-body custom-card" clickable shadow style={{borderTop: "solid orange 5px"}}>
              <ImLocation id="location"/>
                <AUcardInner>
                  <AUcardTitle level="3"><AUcardLink link="/testing" text="How can I get tested?" /></AUcardTitle>
                    <p>Discover how and when you may need to visit a sexual health clinic.</p>
                  </AUcardInner>
            </AUcard>
          </div>
          <div className="quarterSplit">
            <AUcard className="au-body custom-card" clickable shadow style={{borderTop: "solid purple 5px"}}>
                <AiFillMessage id="message"/>
                <AUcardInner>
                  <AUcardTitle level="3"><AUcardLink link="/condoms" text="Everything you need to know about condoms" /></AUcardTitle>
                    <p>Discover the vital role condoms play in sexual health.</p>
                  </AUcardInner>
            </AUcard>
          </div>
          <div className="quarterSplit">
            <AUcard className="au-body custom-card" clickable shadow style={{borderTop: "solid blue 5px"}}>
              <BsDropletFill id="droplet"/>
                <AUcardInner>
                  <AUcardTitle level="3"><AUcardLink link="/common" text="STIs and their symptoms" /></AUcardTitle>
                    <p>Protect and defend yourself against the most common STIs.</p>
                  </AUcardInner>
            </AUcard>
          </div>
        </div>
      </div>
    </div>
  );
}