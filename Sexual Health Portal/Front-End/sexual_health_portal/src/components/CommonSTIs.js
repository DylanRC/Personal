import React from 'react';
import TitleBar from "./TitleBar"
import SideNav from "./side_nav"
import EditableText from './EditableText';

//CommonSTIs Page
export default function CommonSTIs() {
const title = "The facts about STIs";
const text = `Sexually Transmitted Infections (STIs) are more common than you think. If you are sexually active, 
chances are that you will come into contact with an STI at some point in your life.`;

  return (
    <div id="commonSTIsContent">
      <TitleBar background="#000040" colour="white" title={title} text={text} />

        <div class="au-body custom-body custom-style" style={{ minHeight: "400px" }}>
          <div className="sideNav">
            <SideNav title="Common STIs" mainDiv="main-div" items={[
              ["Syphilis", "syphilis-div"],
              ["HIV", "hiv-div"],
              ["Genital Warts (HPV)", "hpv-div"],
              ["Herpes", "herpes-div"],
              ["Mycoplasma Genitalium", "mycoplasma-div"],
              ["Gonorrhoea", "gonorrhoea-div"],
              ["Chlamydia", "chalmydia-div"]
            ]} />
          </div>

          <div className="au-body sideContent">
            <div id="main-div">
              <EditableText id="text-1" class_name=""></EditableText>
            </div>

            <div id="syphilis-div" className="no-space" style={{ display: "none" }}>
              <EditableText id="text-2" class_name=""></EditableText>
            </div>

            <div id="hiv-div" className="no-space" style={{ display: "none" }}>
              <EditableText id="text-3" class_name=""></EditableText>
            </div>

            <div id="hpv-div" className="no-space" style={{ display: "none" }}>
              <EditableText id="text-4" class_name=""></EditableText>
            </div>

            <div id="herpes-div" className="no-space" style={{ display: "none" }}>
              <EditableText id="text-5" class_name=""></EditableText>
            </div>

            <div id="gonorrhoea-div" className="no-space" style={{ display: "none" }}>
              <EditableText id="text-6" class_name=""></EditableText>
            </div>

            <div id="chalmydia-div" className="no-space" style={{ display: "none" }}>
              <EditableText id="text-7" class_name=""></EditableText>
            </div>
          </div>
        </div>
      </div>
  );
}