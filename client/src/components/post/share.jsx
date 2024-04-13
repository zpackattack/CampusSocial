import React from 'react';
import { IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { IconBrandFacebook, IconBrandX } from '@tabler/icons-react';
import moment from "moment";

const ShareButtons = ({ event }) => {
  const shareUrl = "google.com"; // Get the current URL
  const eventDetails = `I will be attending ${event.name}\nat ${moment(event.time, "HH:mm:ss").format("hh:mm A")} on ${moment(event.date).format("MMMM DD, YYYY")} \n Join CampusSocial Today!`;

  return (
    <div>
      <FacebookShareButton url={shareUrl} title={eventDetails}>
        <IconButton>
          <IconBrandFacebook />
        </IconButton>
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={eventDetails} via="yourTwitterHandle">
        <IconButton>
          <IconBrandX />
        </IconButton>
      </TwitterShareButton>
    </div>
  );
};

export default ShareButtons;
