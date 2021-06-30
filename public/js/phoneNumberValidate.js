function phoneValidate(number){
  if(number.trim().match(/^((\+1)?[\s-]?)?\(?[1-9]\d\d\)?[\s-]?[1-9]\d\d[\s-]?\d\d\d\d/) == null) {
      return false;
  }
}
