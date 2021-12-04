import '../styles.css';
import React from 'react';
import AccordionV2 from './AccordionV2';
import TitleBar from './TitleBar';


//FAQs Page
export default function FAQs() {
const text = "Here are the answers to some of the most common questions we are asked."

  return (

    <div id="faqsContent">

      <TitleBar background="rgb(0, 110, 150)" colour="white" title="Frequently Asked Questions" text={text}/>
      <div className="au-body custom-body custom-style">
        
        <br/>
        <h2><bold>Popular Questions</bold></h2>

        <ul className="au-accordion-group">
          <AccordionV2 id="6"
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
          <AccordionV2 id="7"
            title={"What can I do to protect myself against STIs?"} 
            text={
              <p>
                <br/>
                <li>STIs such as chlamydia, gonorrhoea, trachomatis, mycoplasma, syphilis and HIV can only be prevented using barrier protection such as condoms (male and female) and dental dams (used during oral sex).</li>
                <li>These barriers methods can also reduce the risk of herpes and genital warts, however as these are transmitted through direct skin contact barrier methods may not cover the infected areas where transmission occurs</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="8"
            title={"Can I use anything as lubricant with condoms?"} 
            text={
              <p>
                <br/>
                <li>No.</li>
                <li>Water based lubricants are required to be used with latex barriers such as condoms or dams. Other lubricants such as silicone-based lubricants can affect the integrity of the condom and increase the risk of the condom breaking during sex.</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="9"
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
          <AccordionV2 id="10"
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


        <br/>
        <h2><bold>Safe Sex</bold></h2>

        <ul className="au-accordion-group">
          <AccordionV2 id="11"
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
          <AccordionV2 id="12"
            title={"What is PrEP and should I be on it?"} 
            text={
              <p><br/>Pre-exposure prophylaxis (PrEP) is a medication that is used to reduce the risk of acquiring HIV. It will depend on your personal preferences and your risk of acquiring HIV whether you should be taking PrEP.</p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="13"
            title={"Can I get an STI from anything other than vaginal or anal sex?"} 
            text={
              <p>
                <br/>
                <li>It is possible to contract an STI from oral sex such as chlamydia and gonorrhoea.</li>
                <li>Those that inject drugs are at a higher risk of transmitting HIV and hepatitis if sharing equipment. To reduce this risk, it is recommended to never share injecting equipment. Sterile injecting equipment can be accessed at needle exchange programs.</li>
              </p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="14"
            title={"Can I get an STI from oral sex?"} 
            text={
              <p><br/>Yes you can get certain STI’s from oral sex. Chlamydia, gonorrhoea, herpes and syphilis are the most common STIs that can be transmitted in this way. HPV can also be transmitted through oral sex.</p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="15"
            title={"If any STI is detected, will this affect my future fertility, pregnancy, or general health?"} 
            text={
              <p><br/>There are many different STIs. Depending on the STI will determine possible affects on future fertility, pregnancy and general health. How long the STI has been present will also be a factor to consider.</p>      
            }>
          </AccordionV2>
        </ul>

        <br/>
        <h2><bold>Contraception</bold></h2>
        <ul className="au-accordion-group">
          <AccordionV2 id="16"
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
          <br/>
          <AccordionV2 id="17"
            title={"Does the 'pull-out' method prevent pregnancy?"} 
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
          <AccordionV2 id="18"
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

        <br/>
        <h2><bold>STI Treatment</bold></h2>
        <ul className="au-accordion-group">
          <AccordionV2 id="19"
            title={"If I have tested positive, how many partners do I need to contact?"} 
            text={
              <p><br/>It will depend on when your last STI test was and which STI you test positive for. You will usually be asked to contact partners from at least the past month.</p>      
            }>
          </AccordionV2>
          <br/>
          <AccordionV2 id="20"
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
          <AccordionV2 id="21"
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
    </div>
  );
}