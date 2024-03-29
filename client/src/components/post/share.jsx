import React from 'react';
import { IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

const ShareButtons = ({ event }) => {
  const shareUrl = "google.com"; // Get the current URL
  const eventDetails = `I will be attending ${event.name}\n${event.descriptions}\nDate/Time: ${event.date} ${event.time}\n`;

  return (
    <div>
      <FacebookShareButton url={shareUrl} subject={eventDetails}>
        <IconButton>
          <ShareIcon />
        </IconButton>
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={eventDetails} via="yourTwitterHandle">
        <IconButton>
          <ShareIcon />
        </IconButton>
      </TwitterShareButton>
    </div>
  );
};

export default ShareButtons;
