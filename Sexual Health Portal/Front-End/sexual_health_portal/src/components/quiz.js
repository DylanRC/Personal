import React from 'react';
import AUbutton from '@gov.au/buttons';


//Quiz Component
export default class Quiz extends React.Component {
    
    questions = [];
    type = "";
    
    setQuiz() {
        var quiz_qs = [
            "simple",
            ["What is your age?", "Under 25", "25 to 35", "Above 35"],
            ["Are you an Aboriginal or Torres Strait Islander?", "Yes", "No"],
            ["What is your gender experience?", "Male", "Female", "Non binary", "Different identity"],
            ["How do you identify your sexual orientation?", "Straight / hetrosexual", "Bisequal", "Lesbian, gay, or homosexual", "Queer", "Other", "Prefer not to answer"],
            ["Have you ever had oral, vaginal, or anal sex?", "Yes", "No"],
            ["Have you ever had an STI test?", "Yes", "No"],
            ["Did your last STI test return positive?", "Yes", "No"],
            ["How long has it been since your last STI test?", "Less than 3 months", "Between 3 and 6 months", "Over 6 months but less than a year", "Over 1 year"]
        ];

        var risk_qs = [
            "advanced",
            ["start", "Have you ever had vaginal, oral, or anal sex?", ["Yes", "condom"], ["No", "highly_unlikely"]],
            ["condom", "Did you use a condom every time?", ["Yes", "very_low"], ["No", "sti"]],
            ["sti", "Have you had an STI since you last had unprotected vaginal, oral, or anal sex?", ["Yes", "high"], ["No", "low"]],
            ["high", "You’re at high risk of an STI and need to go for an STI test", ["Not all STIs have symptoms, which is why it’s important to get checked out as soon as you can. STI tests are super quick, easy, and often free. So many young people are getting tested nowadays too, so there’s really nothing to worry about. It’s just a normal part of a healthy and confident sex life. Remember – always use a condom and get tested every 6-12 months, when you change partners, or if you show symptoms.", -1]],
            ["low", "You’re at low risk of having an STI", ["You’re at low risk of having an STI as you went and got tested – which was definitely the right thing to do. As you know, getting tested is just a normal part of a healthy and confident sex life. Use condoms each time you have sex and keep up the good work by getting tested every 6-12 months, when you change partners, or if you show symptoms. Regular STI tests should be part of your sex life, even if you’re using condoms.", -1]],
            ["very_low", "You’re at a very low risk of having an STI", ["It’s great news that you’re using condoms every time, as they’re a very reliable way to protect against STIs. They don’t protect from everything 100% of the time though, so if you ever show any symptoms it’s worth getting checked out by a doctor. In fact, if you’re sexually active, the best way to stay healthy is to keep using condoms and have regular STI tests every 6-12 months, when you change partners, or if you show symptoms. It’s just a normal part of having a healthy and confident sex life.", -1]],
            ["highly_unlikely", "It’s highly unlikely that you have an STI", ["Looks like you’ve got nothing to worry about. Remember though, when you are ready to have sex always use a condom. They’re the safest and most reliable contraception and help protect from both pregnancy and STIs. Regular STI testing every 6-12 months, when you change partners, or if you show symptoms is also important. It’s just a normal part of having a healthy and confident sex life.", -1]]
        ];

        if (this.props.type === "quiz") {
            this.questions = quiz_qs;
        } else if (this.props.type === "risk") {
            this.questions = risk_qs;
        }

        // Get the type (advanced or simple). Simple is just questions in order
        // but advanced had different questions asked depending on previous answers
        this.type = this.questions.shift();
    }

    results = [];
    
    constructor(props) {
        super(props);

        // Set it appropiately and pick the quiz questions
        this.resetState();
    }

    resetState() {

        // Reset the quiz questions
        this.setQuiz();

        // The risk calc skips the welcome page
        // Don't ask why this needs both, I couldn't be bothered to
        // fix whatever other bug was causing it to need .state as well 😅
        if (this.type === "simple") {
            this.state = { page: -1 };
            this.setState({ page: -1 });
        } else if (this.type === "advanced") {
            this.state = { page: 0 };
            this.setState({ page: 0 });
        }
    }

    buttonClick(index) {

        // Record the result
        if (index !== -1) {
            this.results.push(index);
        }

        // Move to the next page if we're simple quiz or the first page 
        if (this.type === "simple") {
            this.setState({
                page: this.state.page + 1
            })
        } else if (this.type === "advanced") {

            // Get the index of the next option
            var next_id = this.questions[this.state.page][index + 2][1];

            // Get the index of the next page
            var next_index = -1;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i][0] === next_id) next_index = i;
            }

            // Set the index
            this.setState({
                page: next_index
            })
        }
    }

    // Remove the first and last elements from an array
    removeFirstLast(array) {
        return array.filter(element => array.indexOf(element) > 1 && array.indexOf(element) !== array.length);
    }

    render() {

        // The starting page
        if (this.state.page === -1) {
            return (
                <div class="quiz_page">
                    <AUbutton as='secondary' onClick={() => { this.buttonClick(-1) }}>
                        Take the quiz
                    </AUbutton>
                </div>
            );

        // If we're the last question or the quiz is advanced and hasn't reached an endpoint (-1) yet
        } else if ((this.type === "simple" && this.state.page < this.questions.length) || (this.type === "advanced" && this.questions[this.state.page].slice(-1)[0][1] !== -1)) {

            // Do all the questions in order
            if (this.type === "simple") {
                return (
                    <div class="quiz_page">
                        <h2>{this.questions[this.state.page].shift()}</h2>
                        {this.questions[this.state.page].map((button, index) => (
                            <AUbutton as='secondary' onClick={() => { this.buttonClick(index) }}>
                                {button}
                            </AUbutton>
                        ))}
                    </div>
                );
            }

            // Jump around the questions as needed
            else if (this.type === "advanced") {

                // Return the html
                return (
                    <div class="quiz_page">
                        <h2>{this.questions[this.state.page][1]}</h2>
                        {this.removeFirstLast(this.questions[this.state.page]).map((button, index) => (
                            <AUbutton as='secondary' onClick={() => { this.buttonClick(index) }}>
                                {button[0]}
                            </AUbutton>
                        ))}
                    </div>
                );
            }

        // The end page
        } else {

            // Simple minded people get simple minded quizzes
            if (this.type === "simple") {
                return (
                    <div class="quiz_page">
                        <h2>Thanks! You have completed the quiz</h2>
                        <p>Your answers will help show information just for you. You can change your answers by taking the quiz again</p>
                        <AUbutton as='secondary' onClick={() => { this.resetState(); }}>
                            Take Quiz
                        </AUbutton>
                        <a href="./">Forget Me</a>
                    </div>
                );
            }

            // End page for advanced quiz, content is taken from the current "this.page"
            else if (this.type === "advanced") {
                return (
                    <div class="quiz_page">
                        <h2>{ this.questions[this.state.page][1] }</h2>
                        <p>{ this.questions[this.state.page][2][0] }</p>
                        <a href="/testing">Learn More</a>
                    </div>
                );
            }
        }
    }
}