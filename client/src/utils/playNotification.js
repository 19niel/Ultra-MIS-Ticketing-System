export const playNewTicketSound= () => {
  const audio = new Audio('/sounds/newTicketSound.wav');
  audio.play().catch(error => {
    // This catches the "Autoplay" error if the user hasn't clicked anything yet
    console.log("Sound could not play due to browser policy:", error);
  });
};

export const playNotifTicketSound = () => {
  const audio = new Audio('/sounds/notifTicketSound.wav');
  audio.play().catch(error => {
    // This catches the "Autoplay" error if the user hasn't clicked anything yet
    console.log("Sound could not play due to browser policy:", error);
  });
};


export const playResolveTicketSound = () => {
  const audio = new Audio('/sounds/resolveTicketSound.wav');
  audio.play().catch(error => {
    // This catches the "Autoplay" error if the user hasn't clicked anything yet
    console.log("Sound could not play due to browser policy:", error);
  });
};

export const playfailedTicketSound = () => {
  const audio = new Audio('/sounds/failedicketSound.wav');
  audio.play().catch(error => {
    // This catches the "Autoplay" error if the user hasn't clicked anything yet
    console.log("Sound could not play due to browser policy:", error);
  });
};

export const playchattSound = () => {
  const audio = new Audio('/sounds/chatSound.wav');
  audio.play().catch(error => {
    // This catches the "Autoplay" error if the user hasn't clicked anything yet
    console.log("Sound could not play due to browser policy:", error);
  });
};