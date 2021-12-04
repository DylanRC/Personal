import React from 'react';
import TitleBar from './TitleBar';
import CardV2 from './CardV2';
import AccordionV2 from './AccordionV2';
import EditableText from './EditableText';

//STI Testing Page
export default function Testing() {
  const title = "STI Testing";
  const text = "With many STIs not having symptoms, regular testing is an important part of a healthy and confident sex life."

  return (
    <div id="testingContent">

      <TitleBar background="#4B9095" colour="white" title={title} text={text} />

      <div class="au-body main-content custom-body custom-style">

        <EditableText id="text-1" class_name=""></EditableText>

        <div className="resize">
          <CardV2 id="2" 
            title="13Health Webtest"
            text = "Order a free Chlamydia and Gonorrhoea test online." 
            ratio={298/148}
            link="https://www.qld.gov.au/health/staying-healthy/sexual-health/chlamydia-test/order"
            image="/assets/13health-webtest.jpg"
          />
        </div>
        
        <EditableText id="text-2" class_name=""></EditableText>

        <ul class="au-accordion-group mt-4">
          <AccordionV2 id="22"
            title={"If any STI is detected, will this affect my future fertility, pregnancy, or general health?"} 
            text={
              <p><br/>There are many different STIs. Depending on the STI will determine possible affects on future fertility, pregnancy and general health. How long the STI has been present will also be a factor to consider.</p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="23"
            title={"What should I expect to happen during an STI test?"} 
            text={
              <p>
                <br/>
                <li>What happens at your appointment will depend on where you are seen. There are several different ways to get an STI test. You can order them to your house or be seen in a clinic. Each clinic will run differently. Some have express clinics which are solely for quick STI screening, others will have walk in clinics, and some will have set appointment times.</li>
                <li>During an appointment with a clinician (nurse or doctor) you can expect appropriate questions to be asked to determine your risk of being exposed to an STI and the site/s. These questions will relate to your social and sexual practices. Some questions that may be asked include but not limited to:</li>
                <ul>
                  <li>your sexual orientation (who you like you have sex with)</li>
                  <li>number of sexual partners</li>
                  <li>sexual practices</li>
                  <li>whether you have any symptoms</li>
                  <li>whether you have injected drugs</li>
                  <li>whether you have any tattoos or body piercings.</li>
                  <li>Once your risk of acquiring an STI and the sites has been determined then the appropriate tests will be arranged. These may include but are not limited to: urine test, swabs of your genitals, throat swab, rectal swab or blood test.</li>
                </ul>
                <li>If you have symptoms of any sort an examination will likely be required, and additional tests may be completed.</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="24"
            title={"Would I know if I had an STI?"} 
            text={
              <p>
                <br/>
                <li>Not always. The majority of STIs do not have any symptoms. Some people will have symptoms depending on the site of the infection.</li>
                <li>Symptoms may include but are not limited to:</li>
                <ul>
                  <li>Genital discharge</li>
                  <li>Rectal discharge and/or pain</li>
                  <li>Painful urination</li>
                  <li>Ulcers or blisters</li>
                  <li>Rash on the body or genitals</li>
                  <li>Unusual lumps or bumps in the genitals</li>
                  <li>Pain during sex</li>
                </ul>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="25"
            title={"I might have come in contact with an STI, what should I do?"} 
            text={
              <p>
                <br/>
                <li>If you think you have come in contact with an STI it is important that you have an STI test. The timing of the STI test is important. Testing for an STI too soon may result in a false negative test. STI testing should occur around 1 week after possible exposure.</li>
                <li>If you know what type of STI you might have come in contact with this can be very helpful to medical professionals.</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="26"
            title={"Is there any difference between an STI and an STD?"} 
            text={
              <p>
                <br/>
                <li>The answer is no.</li>
                <li>The terms Sexually Transmitted Infections (STI) and Sexually Transmitted Diseases (STD) are often used interchangeably. However, the preferred terminology is STI. A disease implies that it cannot be cured or managed, whereas infection means you can get treatment.</li>
              </p>      
            }>
          </AccordionV2>
        </ul>
      </div>
    </div>
  );
}