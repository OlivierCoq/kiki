  const formatText = (text: string) => {
    // Convert new lines to <br> for HTML display
    return text?.replace(/\n/g, '<br>');
  }
  export default formatText;