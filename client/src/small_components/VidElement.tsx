import React from "react";

interface Link {
  embeddedLink: string;
};

const VidElement = ({embeddedLink} : Link) => {
  return (
    <div>
      <div className="video-responsive mt-5">
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            className="embed-responsive-item"
            src={embeddedLink}
            width="1000"
            height="560"
            title="video"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VidElement;
