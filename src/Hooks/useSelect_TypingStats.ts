import React, { useState } from 'react'

export const useSelect_TypingStats = () => {

  const [selected_Test_Scope,SetTestScope] = useState("25")
  const [selectedMode, SetSelectedMode] = useState("time")
  const [selectedLengthDuration, SetLengthDuration] = useState("5")


  return {selectedMode,SetSelectedMode,selectedLengthDuration,SetLengthDuration, selected_Test_Scope, SetTestScope}
}
