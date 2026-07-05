import React from "react";
import { FeatureCardIntegration } from "../feature-card-integration";
import { FeatureCardReply } from "../feature-card-reply";
import { FeatureCardSocial } from "../feature-card-social";
import { FeatureCardGraph } from "../feature-card-graph";

const Feature = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-2">
      <div>
        <h2 className="text-3xl font-bold">Connected to your world</h2>
        <p className="text-lg text-gray-400">
          Relay talks to Gmail, Calendar, and Notion directly — no copy-pasting
          context into a chat box.
        </p>
      </div>
      <div>
        <FeatureCardIntegration />
        {/* <FeatureCardReply /> */}
        <FeatureCardSocial />
        <FeatureCardGraph />
      </div>
    </div>
  );
};

export default Feature;
