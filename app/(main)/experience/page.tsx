import ImageHeader from "@/components/image-header";
import IntroductionCard from "@/components/introduction-card";
import PageTitle from "@/components/page-title";
import React from "react";

const DetailsPage = () => {
  const img = "/images/landscape.jpg";

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <ImageHeader img={img} title="Experience" />

      <div className="flex flex-col items-center">
        <PageTitle
          title="My Camera and I are a Witness"
          subtitle="GOD CREATES THE BEAUTY"
        />

        <IntroductionCard
          title="My Focus"
          description="I have been doing photography for a little over five years. Since becoming a mom, it has become even more important to me to have high quality photos that are taken through someone else's view that I can look back on and remember just how tiny my baby was at one point. I focus on capturing the growth of a family. From maternity, to newborn, to cake smash, to yearly family portraits, this is where I want to invest my time, helping other families document their precious family for years to come."
          imageUrl="/images/home-1.jpg"
          direction="left"
        />

        <IntroductionCard
          title="Locations"
          description="I am a natural light photographer who loves the golden hour! The hour before sunset gives off the most delicate glow that will make your pictures warm and dreamy. Whether your style is a flower field, an apple orchard, or the city, I will follow you to wherever you feel most comfortable and be with you every step of the way,"
          imageUrl="/images/home-2.jpg"
          direction="right"
        />

        <IntroductionCard
          title="Before the Session"
          description="Once your session is booked, you will receive an email with a few preparations for your session as well as expectations as to what to expect during your session.. I will offer styling help to ensure your outfits are flattering and coordinating, tips for keeping small children happy during the session, as well as how to prepare the kids (and husband!) for what is to come."
          imageUrl="/images/home-1.jpg"
          direction="left"
        />
      </div>
    </div>
  );
};

export default DetailsPage;
