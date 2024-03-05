export function splitByDot(InputString){
  return InputString.split('.');
};
export function deleteSpace(InputString) {
  InputString = InputString.replace(/\n/g, ' ');   
  InputString = InputString.replace(/\)/g,'');   
  InputString = InputString.replace(/\(/g,'');   
  return InputString;
};