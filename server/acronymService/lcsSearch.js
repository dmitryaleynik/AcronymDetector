/* 'use strict'
class Subsequence {
    
  constructor(sub, abrIndex, defIndex) {

    if(arguments.length == 2) {

      this.abrIndex = arguments[0];
      this.defIndex = arguments[1];
      this.chars = [];
      this.indexOfChars = [];

    } else {

      this.chars = sub.chars.slice();
      this.indexOfChars = sub.indexOfChars.slice();
      this.defIndex = sub.defIndex;
      this.abrIndex = sub.abrIndex;
    }  
    }
  }

let lcsSearch  = {
      findLcsSizeTable: function(abr, def) {
        
        let sizeMatrix = []
        let notFirstOccurenceMatrix = [];
        for (let i = 0; i <= abr.length; i++) {
          sizeMatrix[i] = [];
        }
    
        for (let i = 0; i <= abr.length; i++) {
          notFirstOccurenceMatrix[i] = [];
        }
    
        for (let i = 0; i <= abr.length; i++) {
          for(let j = 0 ; j <= def.length; j++) {
            notFirstOccurenceMatrix[i][j] = 0;
          }
        }
    
        for (let i = 0; i <= abr.length; i++) {
          let occurenceOFCharachter = false;
          for (let j = 0; j <= def.length; j++) {
    
    
            if (i == 0 || j == 0) {
              sizeMatrix[i][j] = 0;
            }
             else {
              if (abr[i - 1] == def[j - 1]) {
    
                if (occurenceOFCharachter) {
                  notFirstOccurenceMatrix[i][j] = 1;
                }
                sizeMatrix[i][j] = 1 + sizeMatrix[i-1][j-1];
                occurenceOFCharachter = true;
              }
              else {
                sizeMatrix[i][j] = Math.max(sizeMatrix[i-1][j], sizeMatrix[i][j-1]);
              }
            }
          }
        }
        return {
          sizeMat: sizeMatrix,
          occurenceMat: notFirstOccurenceMatrix
        };
      }
      function findLongestSubs(abr, def, sizeMatrix, notFirstOccurenceMatrix) {
        let stack = [];
        
        let allLongestSubs = [];
    
        stack.push(new Subsequence(abr.length, def.length));
    
        do {
          let currentSub =  stack.pop();
          let i = currentSub.abrIndex;
          let j = currentSub.defIndex;
          
          while (i != 0 && j != 0 ) {
          
            if (abr[i - 1] == def[j - 1]) {
              
              if(notFirstOccurenceMatrix[i][j] != 1) {
                
                currentSub.chars.unshift(def[j-1]);
                currentSub.indexOfChars.unshift(j-1); 
                i--;
                j--;
                continue;
    
              } else {
    
                let newSub = new Subsequence(currentSub);
                newSub.chars.unshift(def[j-1]);
                newSub.indexOfChars.unshift(j-1);
                              
                newSub.abrIndex = i - 1;
                newSub.defIndex = j - 1;
                
                stack.push(newSub);
              }
            } 
    
              if (sizeMatrix[i-1][j] > sizeMatrix[i][j-1]) {
                i--;  
              }
              else {
                j--;   
              }  
          }
          allLongestSubs.push(currentSub);
         
        } while(stack.length != 0)
    
        return allLongestSubs;
      } 
} */