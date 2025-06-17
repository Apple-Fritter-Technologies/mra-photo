import ImageHeader from "@/components/image-header";
import IntroductionCard from "@/components/introduction-card";
import PageTitle from "@/components/page-title";
import React from "react";

const MeetMariaPage = () => {
  const img = "/images/landscape.jpg";

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <ImageHeader img={img} title="Meet Maria" position="center" />

      <div className="flex flex-col items-center">
        <PageTitle title="Maria Rose?" subtitle="WHO IS" />

        <IntroductionCard
          title="Hi There, I'm Maria!"
          description={`I am a natural light photographer based out of southeast Michigan! My ambition in life is to love Jesus and use my talents to better serve others. I express "how life really is" through my photos; meaning, not only capturing the "smile and say cheese" shots, but also the the moments you may never even realized happened like holding your child's hand as we're walking to the next spot, or maybe the big belly laughs that happen when you find out your fly is down, to anything in between.`}
          imageUrl="/images/meet-maria/meet-maria.png"
          direction="left"
        />

        <IntroductionCard
          title="The Girl Behind The Camera"
          description="I am a follower of Christ, a wife to the most handsome guy around, and a mommy to my  precious children, Chloe and Charles. You will always find me at my local coffee shop, whether it's six o'clock in the morning or two o'clock in the afternoon. Can you guess why? That's right! Because they serve both coffee AND ice cream!! Two of my favorite things! People always assume I'm a girly girl because I like to get all dolled up, but in reality, I love football, motorcycles, and wrestling! You will always hear me shout GO BLUE while being decked out in Michigan gear on Saturday's come fall time ( the season I thrive in!)."
          imageUrl="/images/meet-maria/meet-maria-2.png"
          direction="right"
        />

        <IntroductionCard
          title="Capturing the Essence"
          description="Since I've been a little girl, food and photography has always been on my agenda career wise; in my adult years, those dreams have become realities. I have graduated from schoolcraft with my culinary degree and I am also continually building my portfolio and making new friends through my clients. So lets grab a coffee and chat about how you envision your next session!"
          imageUrl="/images/meet-maria/meet-maria-3.png"
          direction="left"
        />
      </div>
    </div>
  );
};

export default MeetMariaPage;
