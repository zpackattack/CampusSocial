import React from 'react';
import { IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { IconBrandFacebook, IconBrandX } from '@tabler/icons-react';
import moment from "moment";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const ShareButtons = ({ event }) => {
  const { darkMode } = useContext(DarkModeContext);
  const iconColor = darkMode ? 'white' : 'black';

  const shareUrl = "google.com"; 
  const eventDetails = `I will be attending ${event.name}\nat ${moment(event.time, "HH:mm:ss").format("hh:mm A")} on ${moment(event.date).format("MMMM DD, YYYY")} \n Join CampusSocial Today!`;

  return (
    <div>
      <FacebookShareButton url={shareUrl} title={eventDetails}>
        <IconButton>
          <IconBrandFacebook color={iconColor}/>
        </IconButton>
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={eventDetails} via="yourTwitterHandle">
        <IconButton>
          <IconBrandX color={iconColor}/>
        </IconButton>
      </TwitterShareButton>
    </div>
  );
};

export default ShareButtons;
