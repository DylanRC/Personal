
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('CMS').del()
    .then(function () {
      // Inserts seed entries
      return knex('CMS').insert([
        {
          id: 0,
          element_id: "heading-1",
          page: "condoms",
          data: "<h2>What is a condom?</h2>"
        },
        {
          id: 1,
          element_id: "text-1",
          page: "condoms",
          data: `<p>Think it’s awkward asking someone to wear a condom? Imagine being told you’ve got an <a href="https://sexualhealth.azurewebsites.net/common-stis/">STI</a>. People with STIs often don’t know they’re infected and you can’t tell just by looking at them, so protect yourself just in case.</p>
            <p>Condoms come in different sizes and flavours, meaning there’s never a reason not to use one. By carrying a condom you’ll never be caught in the moment without one.</p>`
        },
        {
          id: 2,
          element_id: "text-2",
          page: "condoms",
          data: `<h2>Where can I get condoms?</h2>
        <p>Condoms can be easily bought at a supermarket, chemist, convenience store, or petrol station, even through vending machines in public toilets or nightclubs. There are also speciality condom websites where you can order them online and get them delivered.</p>
        <p>Free condoms are available at Sexual health clinics and services, including community-based organisations such as Queensland Positive People, Queensland AIDS Council, Open Doors, and some youth centres.</p>`
        },
        {
          id: 3,
          element_id: "text-3",
          page: "condoms",
          data: `<h2>Nervous about buying condoms?</h2>
        <p>You’re not the only one. It can be awkward, especially if you haven’t bought them before. Remember that you’re not the only person buying condoms—there’s plenty of other people having sex and using condoms and the person at the till sells them every day. Consider using a self-service checkout if that helps.</p>
        <h2>Use condoms and get tested regularly</h2>
        <p>For a healthy and confident sex life, always use a condom and get an <a href="/testing">STI test</a> every 6-12 months, when you change partners, or if you show any symptoms. If you sleep with a lot of different people, you’ll need testing more regularly. More sex = more testing. Makes sense, right?</p>
        <p>It goes without saying that before any sex takes place, make sure both parties fully consent.</p>
        <br/>`
        },
        {
          id: 4,
          element_id: "text-1",
          page: "testing",
          data: `<p>Sexually Transmitted Infections (STIs) are more common than ever before and they can have lasting health impacts. If you or your partners are having unprotected sex, you could be at risk of getting one. Take control of your sex life by testing regularly and treating STIs early.</p>

        <blockquote class="green-blockquote">
          <p>Using condoms means you can focus on having great sex, without worrying about STIs or pregnancy</p>
        </blockquote>

        <h2>How often do I need to get tested?</h2>
        <p>You should get tested every 6-12 months or when you change partners, whichever is first. Those that change partners often or are at risk may need to be tested more frequently, for example, every 3 months.</p>

        <h2>Where can I get tested?</h2>
        <p>The best place to get tested is at your doctors, where you’ll need to phone and book an appointment first. There’s no need to be embarrassed or nervous – STI tests are just a normal part of keeping healthy when you’re having sex.</p>

        <blockquote class="green-blockquote">
          <p>Doctor not an option? No problem.</p>
        </blockquote>

        <p>You can also get tested at your closest sexual health clinic or even order a chlamydia and gonorrhoea test online.</p>
`
        },
        {
          id: 5,
          element_id: "text-2",
          page: "testing",
          data: `<h2>How much does it cost?</h2>
        <p>In short, it depends where you go. If you go to your local GP or doctor, it will depend on whether they bulk bill. Not all doctors will, so it’s worth asking over the counter or on the phone. Bulk billing is when the government pays for the total cost of seeing a doctor if you have a medicare card.</p>
        <p>If you choose a sexual health clinic, there are some that offer free appointments and STI testing. It’s best to ask about the cost before your appointment.</p>
        <br/>`
        },
        {
          id: 6,
          element_id: "text-1",
          page: "treatment",
          data: `<blockquote class="black-blockquote">
              <p>First up, kudos to you for taking control of your health and going for an STI test. The fact that it’s positive is nothing to be ashamed or embarrassed about.</p>
            </blockquote>

            <h2>When to start your STI treatment</h2>
            <p>Starting treatment straight away is the most important next step to take – even if the symptoms are minimal and you’re not experiencing any pain. That’s because the sooner you start, the more effective the treatment is.</p>
            <p>Your doctor will be able to tell you what STI treatment you’ll need. For common STIs like Chlamydia, it’s a simple course of antibiotics. Other STIs will have other treatments.</p>

            <blockquote class="black-blockquote">
              <p>Remember to always finish your course of medication, even if your symptoms disappear</p>
            </blockquote>

            <h2>Alongside your STI treatment you’ll need to tell your partners</h2>
            <p>You may need to contact any partners you have had sex with recently, so they can get tested and treated too. This is called contact tracing and it’s something you can chat to your doctor about.</p>

            <p>If you want more information, please follow us on our social media platform.</p>
            <br/>
            `
        },
        {
          id: 7,
          element_id: "text-2",
          page: "treatment",
          data: `<p>In the real world, cost is always an issue which is completely understandable. Most treatments will cost something, but make sure you ask your doctor or local pharmacy about options.</p>
            <h2>STI treatment costs vary</h2>
            <p>The cost of antibiotics for treating an STI like Chlamydia (the most common STI in young people) generally ranges from $10-$20. But, if you have a healthcare card you will usually only pay the dispensing fee, which is about $6.</p>
            <blockquote class="black-blockquote">
              <p>Talk to your doctor or give the pharmacy a call and they’ll be able to give you advice about costs.</p>
            </blockquote>
            <h2>STI treatment cost – are there other options?</h2>
            <p>There might be a youth health clinic or other services available where you can get the treatment for free.</p>       `
        },
        {
          id: 8,
          element_id: "text-3",
          page: "treatment",
          data: `<p>Some STIs can be cured through antibiotic medication, such as Chlamydia, the most common STI in young people. This involves taking two tablets once and then avoiding sexual activity for seven days. Your doctor will prescribe them for you.</p>
            <h2>STI treatments depend on the STI</h2>
            <p>Other STIs, like Herpes, can’t be cured but can be managed through medication which reduces symptoms. It’s important to remember that it’s a very common STI (one in eight people) and to talk to your doctor or Nurse Emma if you have any questions.</p>
            <blockquote class="black-blockquote">
              <p>Some treatments are available over the counter at the local pharmacy and others will require a prescription from your doctor</p>
            </blockquote>`
        },
        {
          id: 9,
          element_id: "text-4",
          page: "treatment",
          data: `<h2>Who do I tell that I’ve got an STI?</h2>
            <p>Firstly, you need to think about which partners – past and current – need to be informed. If you’re not in a relationship, have a think about any recent sex you’ve had.</p>
            <blockquote class="black-blockquote">
              <p>It can seem scary to tell someone you have an STI, but somone else can help contact them for you to make it easier</p>
            </blockquote>
            <h2>How do I tell someone I’ve got an STI?</h2>
            <ul>
              <li>You can choose to tell your sexual partners yourself. This is the best way as most would like to be told privately and in person.</li>
              <li>You can also choose to text or email. Your doctor can have a chat with you about what to say or how to approach it.</li>
              <li>You can anonymously send a text or email using services such as 'Let them know', 'Better to know' and 'The Drama Downunder'</li>
              <li>If you don’t feel comfortable doing this yourself you can ask your doctor for help. This can be done anonymously too.</li>
            </ul>
            <br/>
            <h2>Why do I need to tell someone I’ve got an STI?</h2>
            <ul>
              <li>Firstly, it can prevent you from being re-infected. That’s because many STIs have no symptoms, so your partner may have an infection without even knowing.</li>
              <li>Secondly, it informs any previous partners you’ve had sex with so they can go and get tested. They have the right to know, even though it might seem difficult to tell them.</li>
              <li>Thirdly, it helps to reduce the number of people with STIs in the community altogether. Which can only be a good thing right?</li>
            </ul>
            <br/>
            <h2>What if I used condoms?</h2>
            <p>Yep, condoms are an effective form of protection against STIs, but you should still inform your partners so that they can get tested. Be honest.</p>`
        },
        {
          id: 10,
          element_id: "text-1",
          page: "common",
          data: `<p>Although STIs are extremely common, there’s good news. Using <a href="/condoms">condoms&nbsp;</a>can reduce the risk of getting an STI, and, even if you do get one, treating STIs is easy in most cases – if caught early.</p>
              <h2>What is an STI?</h2>
              <p>A sexually transmissible infection (STI) is an infection that you can get from any form of sexual activity, including vaginal, anal and oral sex, sharing sex toys, or close sexual contact.</p>
              <p>They’re super common and the number of cases is on the rise in Australia, particularly among young people. The good news is that with the right protection, correct information and regular health checks, most STIs can be avoided or treated.</p>
              <blockquote class="black-blockquote"><p><bold>Many STIs don’t have symptoms, but are often easy to treat if caught early. That’s why regular STI testing is so important.</bold></p></blockquote>
              <h2>What effects can STIs have?</h2>
              <p>STIs can cause pain and discomfort. If left untreated they can cause long-term, complex health problems.</p>
              <h2>How can I tell if someone has an STI?</h2>
              <p>The simple answer is you can’t. Many STIs don’t have symptoms and it is very common for someone to have an STI and not know about it. They might even be showing minimal symptoms and not realise what’s going on.</p>
              <h2>How can I protect myself from STIs?</h2>
              <p>The most effective way to avoid STIs is by using <a href="/condoms">condoms</a> for penetrative sex (oral, vaginal, or anal) and having regular STI tests.</p>
              <p>Make sure to get tested every 6-12 months and when you change partners.</p>
              <p>STI testing is fast, easy and most importantly nothing to be ashamed or embarrassed about. They’re just part of a healthy and confident sex life.</p>
              <p>You can get an STI test at your GP or a sexual health clinic. Use our <a href="https://www.google.com.au/maps/search/sexual+health+clinics/@-27.3360803,152.3088521,9z">clinic finder</a>.</p>`
        },
        {
          id: 11,
          element_id: "text-2",
          page: "common",
          data: `<h2>What is syphilis?</h2>
              <p>Syphilis is a sexually transmissible infection (STI) caused by a bacterium called 'Treponema pallidum'. It can affect both men and women. Syphilis is transmitted through close skin-to-skin contact and is highly contagious when the syphilis sore (chancre) or rash is present.</p>
              <br/>
              <p>Early treatment of syphilis is effective, but people may not have any symptoms or may not notice the symptoms of early syphilis and therefore may not seek medical advice.</p>
              <br/>
              <h2>How do you catch Syphilis?</h2>
              <p>Syphilis is spread (transmitted) through close skin-to-skin contact with an infected area. You can catch syphilis by having unprotected oral, vaginal or anal sex with a person who is in the first two stages of the infection. Syphilis is highly contagious when the sore or rash is present and direct contact with either can result in syphilis being transmitted from one person to another.</p>
              <br/>
              <p>Although rare in Australia, pregnant women who have syphilis can pass on the infection to their baby during pregnancy or at birth.</p>
              <br/>
              <p>Syphilis can also be passed through infected blood. However, blood used in blood donations is routinely screened for syphilis in Australia.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>There are three stages of syphilis. Only the first two stages are infectious and symptoms vary according to the stage. Having symptoms of syphilis can make you more at risk of HIV infection during sexual contact.</p>
              <br/>
              <h2>Symptoms in the first stage of syphilis</h2>
              <p>You may miss the first stage of syphilis (four to 12 weeks)as you may have no symptoms. Or, symptoms may occur as a sore (ulcer) on the genital area (including the penis or vagina), anus or the mouth. The sore:</p>
              <ul>
                <li>may be difficult to notice</li>
                <li>may be in the mouth or rectum or on the vagina or cervix</li>
                <li>is more likely to occur as a single sore but occasionally occurs as multiple sores</li>
                <li>is usually painless</li>
                <li>appears three to four weeks after infection – however, it can occur any time between one and 12 weeks after infection</li>
                <li>usually heals completely within four weeks without any treatment.</li>
              </ul>
              <p>If you are not treated for syphilis at this stage, you may go on to develop the second stage of the disease.</p>
              <br/>
              <h2>Symptoms in the second stage of syphilis</h2>
              <p>During the second stage of syphilis (up to two years), you may have:</p>
              <ul>
                <li>a flat, red skin rash on the soles of your feet or palms of your hands, or it may cover your entire body. The rash is contagious and may mimic other common skin conditions such as measles. The diagnosis may be missed if a syphilis blood test is not done</li>
                <li>swollen lymph nodes</li>
                <li>other symptoms such as hair loss (especially of the eyebrows), pain in the joints or flu-like illness.</li>
              </ul>
              <p>If you are infected with syphilis and do not seek treatment at this stage, you may develop the third stage of the infection.</p>
              <br/>
              <h2>Third stage of syphilis</h2>
              <p>The third stage of syphilis (which may occur 10 to 30 years  after the initial infection) can affect various organs, especially the brain and the heart. This stage occurs in about one third of untreated people. Severe brain or heart complications may occur during this stage. Syphilis is not infectious at this point, but is still treatable.</p>
              <br/>
              <h2>How can you prevent Syphilis?</h2>
              <ul>
                <li>Always have safe sex – use a condom and water-based lubricant for all types of sex.</li>
                <li>Remember that syphilis may be spread through unprotected oral sex.</li>
                <li>If you are a gay man or a man who has sex with men, get a syphilis test and other STI checks at least yearly, and up to four times a year if you have several partners.</li>
                <li>Seek early advice if you notice oral, genital or anal sores, or rashes on your body, hands or feet that you think could be related to recent sexual contact.</li>
                <li>If you are planning or having a family, you and your partner should have an STI test to prevent any infections being passed onto your baby.</li>
              </ul>
              <br/>
              <h2>What is the treatment for Syphilis?</h2>
              <p>Penicillin is a very effective treatment for all stages of syphilis, including congenital syphilis. Other treatments are available if you are allergic to penicillin, or you may be able to undergo a desensitisation procedure that safely allows you to be given penicillin.</p>
              <br/>
              <p>Treatment early in the infection is needed to help prevent further complications and to avoid passing the infection on to sexual partners.</p>
              <br/>
              <p>Avoid sexual contact until your treatment is completed.</p>`
        },
        {
          id: 12,
          element_id: "text-3",
          page: "common",
          data: `<h2>What is HIV and AIDS?</h2>
              <p>The Human Immunodeficiency Virus (HIV) is the virus that causes Acquired Immunodeficiency Syndrome (AIDS). The late stage of HIV infection is called AIDS. Not all people with HIV have AIDS.</p>
              <p>If HIV is not treated, most people will develop severe immune deficiency within 10 years. It is this untreated viral infection that can lead to AIDS, as the body becomes less able to fight infections and protect against cancers developing because the immune system stops working properly.</p>
              <br/>
              <h2>What causes HIV and AIDS?</h2>
              <p>HIV is in the blood, semen, vaginal fluid and breast milk of an infected person. It can be spread by exposure to these body fluids by:</p>
              <ul>
                <li>unprotected anal or vaginal sex without a condom</li>
                <li>sharing drug injecting equipment</li>
                <li>tattooing, piercing and other procedures with unsterile needles or equipment</li>
                <li>transmission from mother to baby during pregnancy, childbirth or breast-feeding</li>
                <li>oral sex and sharps injuries, although this is rare</li>
              </ul>
              <p>It’s important to remember that HIV is not spread through activities such as kissing, sharing cups and cutlery, normal social contact, toilet seats or mosquitoes.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>Most people have no symptoms or a mild flu-like illness when they are first infected with HIV, and it may be difficult to tell them apart from other viral infections. This illness, called ‘seroconversion illness’, often occurs around 10 to 14 days after infection.</p>
              <br/>
              <p>Seroconversion illness can have a range of symptoms including:</p>
              <ul>
                <li>fever</li>
                <li>tiredness</li>
                <li>headache</li>
                <li>sore muscles and joints</li>
                <li>sore throat</li>
                <li>swollen lymph glands in the neck, underarm or groin areas</li>
                <li>rash</li>
              </ul>
              <p>After the initial illness, people with HIV infection usually have no other symptoms, however the virus remains in the body.</p>
              <br/>
              <h2>Can HIV and AIDS be prevented?</h2>
              <p>The best way to prevent HIV infection is to:</p>
              <ul>
                <li>use condoms and a water-based lubricant for anal and vaginal sex</li>
                <li>never share needles, syringes and other injecting equipment</li>
                <li>make sure all tattooing, piercing and other procedures use sterilised equipment</li>
              </ul>
              <p>There are medications which can sometimes prevent HIV from infecting a person who has been exposed. This is known as Post Exposure Prophylaxis (PEP). It is best to start PEP as soon as possible, and within 72 hours (3 days) of exposure.</p>
              <br/>
              <h2>How is HIV and AIDS treated?</h2>
              <p>There is no vaccine or cure for HIV infection. However, there are effective treatments available that can help prevent the progression to AIDS and help ensure a near-normal life expectancy.</p>
              <p>Improvements in treatment now mean that HIV infection is a manageable chronic disease for many people in industrialised countries like Australia.</p>`
        },
        {
          id: 13,
          element_id: "text-4",
          page: "common",
          data: `<h2>What are genital warts?</h2>
              <p>Genital warts are one of the most common sexually transmissible infections (STIs). They are caused by the human papillomavirus (HPV).</p>
              <br/>
              <p>There are more than 100 strains of HPV, but only certain types affect the genitals and not all cause visible warts. Genital warts can appear around the genitals and anus or, sometimes, inside the vagina, rectum or urethra.</p>
              <br/>
              <h2>How do people get HPV?</h2>
              <p>Most HPV is spread during sexual contact, when tiny breaks occur to the skin. Genital warts are very contagious. Genital HPV infection is common in sexually active adults, and most people don’t develop genital warts.</p>
              <br/>
              <p>Condoms reduce the risk of infection by HPV, but don’t completely stop the spread of the virus. However, condoms provide protection against other sexually transmitted infections and are an important part of safe sex for many couples.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>Genital warts are usually painless. They can be bumpy, flat, or appear in clusters. Your doctor can often tell if you have genital warts by examining you.</p>
              <br/>
              <h2>How can I prevent spreading genital warts?</h2>
              <p>If you find out that you have genital warts, try not to freak out. There are a few ways that you can stop it from spreading to your partners.</p>
              <ul>
                <li>There are two HPV vaccine brands available in Australia to help prevent cervical cancer: Cervarix® and Gardasil®9. Both vaccines work by preventing infection with two types of HPV — types 16 and 18. These two types have been shown to cause 70% of cervical cancers.</li>
                <li>Always use condoms and dental dams during oral, anal, and vaginal sex.</li>
                <li>Don’t have sex when you have visible warts, even with a condom. There may be warts on places the condom doesn’t cover</li>
              </ul>
              <br/>
              <h2>Treatment of genital warts</h2>
              <p>Genital warts may clear up without treatment. However, if they are painful, unsightly, itchy or annoying, they can be treated. Treatment doesn’t get rid of the virus itself, just the warts. Your immune system may clear the virus, or it may persist undetected.</p>
              <br/>
              <p>Treatment options include:</p>
              <ul>
                <li>wart paint (specifically for genital warts)</li>
                <li>freezing (cryotherapy) or burning off</li>
                <li>laser treatment</li>
                <li>cream to boost the immune system to fight the HPV virus</li>
                <li>surgery</li>
              </ul>
              <p>Treatments for other types of warts are not suitable for genital warts. See your doctor to discuss treatment options.</p>`
        },
        {
          id: 14,
          element_id: "text-5",
          page: "common",
          data: `<h2>What is Herpes?</h2>
              <p>Herpes is a sexually transmitted infection that is caused by a virus called the Herpes Simplex Virus (HSV). As many as 1 in 8 sexually active Australian adults have Herpes. There are two types of HSV: HSV1 and HSV2. When Herpes appears on the mouth or lips, it’s known as cold sores, while on the vagina, penis, or bum areas it’s called Genital Herpes.</p>
              <br/>
              <p>HSV1 is usually the cause of oral herpes, but also causes about half of genital herpes. HSV2 is rarely found on the mouth, but causes about half of genital herpes. One person can get both HSV1 and HSV2, but it’s unlikely to have the same type in multiple places. Where you get it the first time is where it stays.</p>
              <br/>
              <h2>How do you catch Herpes?</h2>
              <p>You can get Herpes through skin-to-skin contact during oral, vaginal or anal sex. You can also catch it through non-penetrative genital to genital rubbing, rimming, as well as kissing. Herpes is most contagious when you have symptoms, but can sometimes be passed on even when there are no symptoms at all. One of the best ways to lower the risk of Herpes is by using a condom or dental dam.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>Most people infected with Herpes have no symptoms, but some people can experience:</p>
              <ul>
                <li>stinging or tingling in the genital area</li>
                <li>small blisters on the genital area which develop into small painful red sores</li>
                <li>sores that look like a rash or cracked skin on the genitals</li>
                <li>difficulty passing urine</li>
              </ul>
              <p>Due to the nature of the virus  the virus remains dormant (sleeping) in your body for the rest of your life, which means you can experience recurrent episodes (outbreaks) of sores and blisters. recurring episodes are usually milder, shorter and less frequent over time.</p>
              <br/>
              <h2>How can I prevent Herpes?</h2>
              <ul>
                <li>always use condom and dental dams, even when there are no sores or blisters present.</li>
                <li>avoid sex when there are sores or blisters present — you are most infectious at this time</li>
                <li>avoid sex with someone who has any blisters, sores or other symptoms of genital herpes</li>
                <li>avoid oral sex when there is any sign of a cold sore</li>
              </ul>
            </div>

            <div id="mycoplasma-div" className="no-space" style={{ display: "none" }}>
              <h2>What is Mycoplasma Genitalium?</h2>
              <p>Mycoplasma Genitalium (MG) is very similar to Chlamydia, except that the treatment may be different. Also, unlike Chlamydia, asymptomatic testing isn’t recommended (testing when you don’t show any symptoms). MG is caused by a bacteria called Mycoplasma Genitalium.</p>
              <br/>
              <h2>How do you catch Mycoplasma Genitalium?</h2>
              <p>MG is transmitted through genital fluids. You can catch MG by having unprotected oral, vaginal, or anal sex, with someone who has MG. If left untreated, MG can cause persistent pain or long-term complications.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>If you have a vagina, you may notice pain when urinating, an unusual vaginal discharge, pain in the lower belly, unusual bleeding or spotting from the vagina, or pain or bleeding after sex</p>
              <br/>
              <p>If you have a penis, you may notice a burning pain when urinating, whitish discharge coming from your penis, or irritation or soreness around the urethra (opening of the penis)</p>
              <br/>
              <h2>How do I prevent Mycoplasma Genitalium?</h2>
              <ul>
                <li>Condoms can protect you from MG when having oral, vaginal, or anal sex</li>
                <li>If you’ve got MG, don’t have sex with anyone until seven days after you’ve finished your antibiotics</li>
                <li>Don’t have sex with anyone that’s been diagnosed with MG, until seven days after they have finished their course of antibiotics</li>
                <li>Regular STI testing – every 6-12 months – is also important and part of a healthy and confident sex life</li>
              </ul>
              <br/>
              <h2>How do I get tested for Mycoplasma Genitalium?</h2>
              <p>The test is usually either a urine test or a self-collected vaginal swab.</p>
              <br/>
              <h2>How do I get treated for Mycoplasma Genitalium?</h2>
              <p>Mycoplasma Genitalium is usually curable with antibiotics, but can sometimes require more than one course of antibiotics to get rid of. If you do have MG, make sure you let anyone you’ve had sexual contact with know so they can get treated too. And, as always make sure you go back for regular testing.</p>`
        },
        {
          id: 15,
          element_id: "text-6",
          page: "common",
          data: `<h2>What is Gonorrhoea?</h2>
              <p>Gonorrhoea is a curable bacterial infection that’s passed from person to person through bodily fluids during vaginal, anal, or oral sex with someone who has the infection.</p>
              <br/>
              <p>If left untreated it can cause more serious health issues, including pelvic inflammatory disease, painful swelling of the testicles (balls), ectopic pregnancy (pregnancy that happens in the tubes, not the uterus) and infertility (difficulty getting pregnant).</p>
              <br/>
              <h2>How do you catch Gonorrhoea?</h2>
              <p>Gonorrhoea is carried in genital fluids and can be passed on when you have vaginal, anal, or oral sex with someone who has the infection.</p>
              <br/>
              <p>It’s possible, but less likely, that chlamydia can be passed during other types of sex e.g. sharing sex toys, ‘dipping’ (brief insertion of penis into the vagina or bum) or when mutual masturbation or genital to genital rubbing involves a lot of genital fluids.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>Symptoms and signs in people who have a vagina usually develop within 10 days and can include:</p>
              <ul>
                <li>unusual vaginal discharge</li>
                <li>pain, discomfort or burning sensation when passing urine</li>
                <li>pelvic pain, especially during sex</li>
                <li>irregular bleeding, especially between periods or after sex</li>
                <li>anal discharge and discomfort</li>
                <li>sore, dry throat</li>
              </ul>
              <br/>
              <p>Symptoms and signs in people who have penis/testicles usually develop within 1 to 3 days and can include:</p>
              <ul>
                <li>thick, yellow or white discharge from the penis</li>
                <li>pain, discomfort or burning sensation when passing urine</li>
                <li>pain in the testicles (balls)</li>
                <li>redness around the opening of the penis</li>
                <li>anal discharge and discomfort</li>
                <li>sore, dry throat</li>
              </ul>
              <br/>
              <h2>How can you prevent Gonorrhoea?</h2>
              <ul>
                <li>Using condoms during oral, vaginal or anal sex can prevent the infection from being passed on. It’s also reccommened that condoms are used and changed between partners if you’re sharing sex toys.</li>
                <li>If you’ve got gonorrhoea, don’t have sex with anyone until seven days after you’ve started treatment.</li>
                <li>Regular STI testing – every 6-12 months – is also important and part of a healthy and confident sex life.</li>
                <li>Always finish your entire course of antibiotics.</li>
              </ul>
              <br/>
              <h2>What is the treatment for Gonorrhoea?</h2>
              <p>The good news is gonorrhoea is a curable infection and it’s treated with one injection of antibiotics and also tablets which you’ll need to swallow.</p>
              <br/>
              <p>Gonorrhoea is resistant to many types of antibiotics though, so it’s really important that you get the right treatment and take the medication as prescribed. That’s where your doctor will be able to help.</p>
              <br/>
              <p>If you get diagnosed with gonorrhoea be sure to let any sexual partners from the past two months know so they can be tested too. And – as always – make sure you go back for regular testing.</p>`
        },
        {
          id: 16,
          element_id: "text-7",
          page: "common",
          data: `<h2>What is Chlamydia?</h2>
              <p>Chlamydia is the most commonly reported STI and on the rise in Australia. It is estimated that 1 in 5 young people could be carrying it.</p>
              <br/>
              <p>It’s a curable bacterial infection with often no symptoms, and is easily treated with antibiotics.</p>
              <br/>
              <p>If left untreated it can cause more serious health issues, including pelvic inflammatory disease, painful swelling of the testicles (balls), ectopic pregnancy (pregnancy that happens in the tubes, not the uterus) and infertility (difficulty getting pregnant).</p>
              <br/>
              <h2>How do you catch Chlamydia?</h2>
              <p>Chlamydia is carried in genital fluids and can be passed on when you have vaginal, anal, or oral sex with someone who has the infection.</p>
              <br/>
              <p>It’s possible, but less likely, that chlamydia can be passed during other types of sex e.g. sharing sex toys, ‘dipping’ (brief insertion of penis into the vagina or bum) or when mutual masturbation or genital to genital rubbing involves a lot of genital fluids.</p>
              <br/>
              <h2>What are the symptoms?</h2>
              <p>Around 3 in 4 women with chlamydia don’t show any early symptoms. For men, the proportion is about 1 in 2 men. Women can have an infection for years and men can be infected for months without knowing.</p>
              <br/>
              <p>Symptoms and signs in people who have a vagina can include:</p>
              <ul>
                <li>abnormal vaginal discharge</li>
                <li>bleeding or spotting between periods or after sex</li>
                <li>a burning or stinging feeling when peeing</li>
                <li>pain during or after sex</li>
              </ul>
              <br/>
              <p>Symptoms and signs in people who have penis/testicles can include:</p>
              <ul>
                <li>a clear or ‘milky’ discharge from the penis</li>
                <li>redness at the opening of the penis</li>
                <li>a burning or stinging feeling when peeing</li>
                <li>pain or swelling in the testicles (balls)</li>
              </ul>
              <br/>
              <h2>How can I prevent Chlamydia?</h2>
              <ul>
                <li>Using condoms during oral, vaginal or anal sex will prevent the infection from being passed on. It’s also reccommened that condoms are used and changed between partners if you’re sharing sex toys</li>
                <li>If you’ve got Chlamydia, don’t have sex with anyone until seven days after you’ve finished your antibiotics.</li>
                <li>Regular STI testing – every 6-12 months – is also important and part of a healthy and confident sex life.</li>
              </ul>`
        },
      ]);
    });
};
