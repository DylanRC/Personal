import React from 'react';
import AccordionV2 from './AccordionV2';
import CardV2 from './CardV2';
import TitleBar from "./TitleBar";
import EditableText from './EditableText';

//Condoms Page
export default function Condoms() {
const title = "All about Condoms";
const text = "Condoms are the only form of contraception that protects against both pregnancy and STIs.";

  return (
    <div id="condomsContent">
      
      <TitleBar background="#7555a1" colour="white" title={title} text={text}/>

      <div class="au-body main-content custom-body custom-style">
        <EditableText id="heading-1" class_name=""></EditableText>
        <p><iframe title="What you need to know about condoms" width="500" height="281" src="https://www.youtube.com/embed/hNcDm37yj5Q?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe></p>
        
        <EditableText id="text-1" class_name=""></EditableText>   
        <blockquote class="purple-blockquote">
          <p>Using condoms means you can focus on having great sex, without worrying about STIs or pregnancy</p>
        </blockquote>

        <ul class="au-accordion-group mt-4">
          <AccordionV2 id="1" 
            title={"Do condoms protect against everything?"} 
            text={
              <p>
                <br/>
                <li>For anal, vaginal, and oral sex between two folks with penises, or between one person with a penis and one person with a vagina, latex condoms are the best way to help prevent STI transmission during sexual activity.</li>
                <li>However, they aren’t 100 percent protective against infections.</li>
                <li>Any STIs that can be transmitted through skin-to-skin contact — such as HSV, HPV, and trich — can still be transmitted by any area not covered by the condom.</li>
                <li>The same goes for any accidental skin-to-skin contact before the barrier was put in place.</li>
                <li>Any STI transmitted through bodily fluids — like HPV, gonorrhea, chlamydia, HIV, and hepatitis B — can be transmitted through any bodily fluid exchange that might have occurred before the condom was put on.</li>
                <li>For instance, if the tip of a penis with pre-cum rubbed up against a vulva or anus prior to the condom going on, STI transmission can have occurred.</li>
                <li>It’s also worth noting that animal skin condoms don’t protect against STIs. They have holes in them that are big enough for infectious particles to travel through.</li>
                <li>Condoms won’t protect against STI transmission during sex between two vulva owners, or for oral sex performed on vulva owners. Dental dams or repurposed condoms should be used during scissoring and oral sex to help reduce the risk of exposure.</li>
              </p>      
            }>
          </AccordionV2>
        </ul>
        <br/>

        <EditableText id="text-2" class_name=""></EditableText>
       
        <div className="resize">
          <CardV2 id="3" 
            title = "Wrapped'N Ready"
            text = "Free condom distribution program run by the Queensland AIDS Council (QuAC)." 
            ratio={298/148} // 300/151
            link="https://quac.org.au/wrapped-n-ready/"
            image="/assets/wrapped_img.png"
          />
        </div>
        <br/>
        <ul class="au-accordion-group mt-4">
          <AccordionV2 id="2"
            title={"Can I use anything as lubricant with condoms?"} 
            text={
              <p>
                <br/>
                <li>No.</li>
                <li>Water based lubricants are required to be used with latex barriers such as condoms or dams. Other lubricants such as silicone-based lubricants can affect the integrity of the condom and increase the risk of the condom breaking during sex.</li>
              </p>      
            }>
          </AccordionV2>
        </ul>

        <EditableText id="text-3" class_name=""></EditableText>

        <ul class="au-accordion-group mt-4">
          <AccordionV2 id="3"
            title={"Will wearing more than one condom reduce the chance of an STI?"} 
            text={
              <p>
                <br/>
                <li>No, increasing the number of condoms used does not reduce the risk of an STI.</li>
                <li>It is only recommended to use only 1 condom at a time. Using more than 1 condom can cause friction between the condoms, damage their integrity and increase the risk of breakage.</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="4"
            title={"Does the “pull-out” method prevent pregnancy?"} 
            text={
              <p>
                <br/>
                <li>Withdrawal or the “pull-out” method of contraception is one of the least effective ways to prevent pregnancy.</li>
                <li>As a female you are relying on the male to withdraw completely from the vagina prior to ejaculation.</li>
                <li>It is also possible for precum to contain sperm which is expelled from the penis before ejaculation occurs.</li>
                <li>Therefore, this form of contraception is not preferred. There are many different types of contraception both hormonal and non-hormonal all of which are more effective than withdrawal.</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="5"
            title={"Do birth control pills (the pill) protect against STIs?"} 
            text={
              <p>
                <br/>
                <li>No. You can get an STI whilst on the pill.</li>
                <li>Birth control pills, if taken correctly and on a daily basis, are an effective way to prevent pregnancy. However they do not have any protection against STIs.</li>
                <li>STIs such as chlamydia, gonorrhoea, trachomatis, mycoplasma, syphilis and HIV can only be prevented through barrier protection such as condoms (internal and external) and dental dams (used during oral sex or genital contact). These barriers methods can also reduce the risk of herpes and genital warts however as these are transmitted through direct skin contact, barrier methods may not cover the infected areas where transmission occurs.</li>
              </p>      
            }>
          </AccordionV2>
        </ul>
      </div>
    </div>
  );
}