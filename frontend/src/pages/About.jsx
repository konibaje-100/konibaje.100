import React from "react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.abouts_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to Konibaje, a brand built on the essence of resilience,
            hope, and self-expression. Rooted in the Yoruba phrase "it won't
            spoil," Konibaje symbolizes optimism, strength, and the assurance
            that no matter the circumstances, things will remain whole and
            beautiful. This philosophy extends beyond words it’s a way of life,
            a call to embrace the good and radiate positivity.
          </p>
          <p>
            At Konibaje, we believe in the power of affirmations, the energy of
            uplifting statements, and the art of wearing these truths proudly.
            Each piece in our collection carries meaning, crafted to inspire
            confidence and encourage individuality. Our designs are versatile,
            bold, and inclusive because style is as unique as the person wearing
            it. <br /><br /> Whether you’re drawn to minimal elegance, vibrant statements, or
            something in between, there’s something here for you. Konibaje is
            more than a clothing brand; it’s a community that celebrates life’s
            journey, its highs and lows, and everything in between with
            unwavering hope and purpose.
          </p>
          <b className="text-grey-800">Our Mission</b>
          <p>
          To weave hope and positivity into every thread, inspiring individuals to embrace their true selves through timeless designs and affirming statements. We aim to empower our community with clothing that tells a story—your story—while spreading a collective spirit of resilience and optimism. At Konibaje, our mission is clear: <strong> “It won’t spoil”</strong>
          </p>
        </div>
      </div>
      <div className="text-xl py-4`">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className=" text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p>
            With our user friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p>
            Our team of dedicated professionals are here to assist you, ensuring
            your satisfaction is our top priority.
          </p>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  );
};

export default About;
