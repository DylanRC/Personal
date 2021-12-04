import React from 'react';
import TitleBar from './TitleBar';
import AccordionV2 from './AccordionV2';
import SideNav from "./side_nav"
import EditableText from './EditableText';


//STI Treatment Page
export default function Treatment() {
  const title = "STI Treatment";
  const text = "If you’ve had an STI test and it’s come back positive, don’t panic. Treatment for many STIs is quick and easy.";

  return (
    <div id="treatmentContent">

      <TitleBar background="#AA55AA" colour="white" title={title} text={text} />

      <div class="au-body custom-body custom-style" style={{minHeight: "400px"}}>
        <div className="sideNav">
          <SideNav title="Treatment" mainDiv="main-div" items={[
            ["How much does STI treatment cost?", "cost-div"],
            ["What treatments are there for STIs?", "treatment-div"],
            ["How do I tell a partner I have an STI?", "tell-div"],
          ]} />
        </div>

        <div className="au-body sideContent"> 
          <div id="main-div">

            <EditableText id="text-1" class_name=""></EditableText>
            
            <ul class="au-accordion-group mt-4">
              <AccordionV2 id="27"
                title={"If I have tested positive, how many partners do I need to contact?"} 
                text={
                  <p><br/>It will depend on when your last STI test was and which STI you test positive for. You will usually be asked to contact partners from at least the past month.</p>      
                }>
              </AccordionV2>
              <br/>
              <AccordionV2 id="28"
                title={"What will happen if I leave an STI untreated?"} 
                text={
                  <p>
                    <br/>
                    <li>Nothing good! Not only will you be putting your sexual partners at risk but STIs can also have complications if left untreated.</li>
                    <li>STIs such as chlamydia, gonorrhoea, trachomatis and mycoplasma if not treated can lead to pelvic inflammatory disease, infertility and ectopic pregnancy for people with a uterus or testicular pain, infection of part of the testes and/or epididymis which in severe cases can lead to infertility for people with testicles.</li>
                  </p>      
                }>
              </AccordionV2>
            </ul>
          </div>

          <div id="cost-div" style={{ display: "none" }}>
            <EditableText id="text-2" class_name=""></EditableText>
          </div>

          <div id="treatment-div" style={{ display: "none" }}>
            <EditableText id="text-3" class_name=""></EditableText>
          </div>

          <div id="tell-div" style={{ display: "none" }}>
            <EditableText id="text-3" class_name=""></EditableText>
          </div>
        </div>
      </div>
    </div>
  );
}