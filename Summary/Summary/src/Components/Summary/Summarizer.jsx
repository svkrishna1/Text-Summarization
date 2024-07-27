// import React, { useRef, useState, useEffect } from "react";
// import './Summarizer.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCloudArrowUp,
//   faTrashCan,
//   faSquarePollVertical,
//   faCircleArrowDown,
//   faCopy,
//   faXmark,
//   faArrowRight,
// } from "@fortawesome/free-solid-svg-icons";
// import FileDownload from "react-file-download";

// function Tabs() {
//   const fileInputRef = useRef(null);
//   const [leftSide, setLeftSide] = useState({});
//   const [rightSide, setRightSide] = useState({});
//   const [sentNumber, setSentNumber] = useState(5);
//   const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
//   const [isCopyIconHovered, setIsCopyIconHovered] = useState(false);
//   const [isUploadIconHovered, setIsUploadIconHovered] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isDeleteTooltipVisible, setIsDeleteTooltipVisible] = useState(false);
//   const [isStatTooltipVisible, setIsStatTooltipVisible] = useState(false);
//   //   const [userType, setUserType] = useState("paragraph");
//   const [file, setFile] = useState(null);
//   //   const [summaryLength, setSummaryLength] = useState("medium");
//   const [uploadButtonVisible, setUploadButtonVisible] = useState(true);
//   // const [showSentIconSection, setShowSentIconSection] = useState(false);
//   const [showStatistics, setShowStatistics] = useState(false);
//   const [selectedKeywords, setSelectedKeywords] = useState([]);
//   const [activeKeywords, setActiveKeywords] = useState([]);
//   const [clearAllButtonVisible, setClearAllButtonVisible] = useState(true);
//   const [keywordClicked, setKeywordClicked] = useState(false);
//   const [summary, setSummary] = useState();

//   //   const stepOptions = ["Very_Short", "Short", "Medium", "Long"];

//   const handleStatIconClick = () => {
//     setShowStatistics(!showStatistics);
//   };

//   const handleSentNumberChange = (e) => {
//     setSentNumber(parseInt(e.target.value, 10));
//   };

//   const handleFileChange = async (e) => {
//     setFile(e.target.files[0]);
//     setUploadButtonVisible(false);

//     const formData = new FormData();
//     formData.append("file", e.target.files[0]);
//   };

//   //   const handleSummaryLengthChange = (e) => {
//   //     setSummaryLength(stepOptions[parseInt(e.target.value, 10)]);
//   //   };

//   const handleFileInputClick = () => {
//     fileInputRef.current.click();
//     setIsUploadIconHovered(false);
//   };

//   const handleUserTypeChange = (e) => {
//     // setUserType(e.target.value);
//     setActiveKeywords([]);
//     setSelectedKeywords([]);
//     setRightSide([""]);
//   };

//   const handleKeywordClick = (keyword) => {
//     const updatedSelectedKeywords = selectedKeywords.includes(keyword)
//       ? selectedKeywords.filter((k) => k !== keyword)
//       : [...selectedKeywords, keyword];

//     setSelectedKeywords(updatedSelectedKeywords);
//     setActiveKeywords(updatedSelectedKeywords);

//     const clearAllVisible = updatedSelectedKeywords.length > 1;
//     setClearAllButtonVisible(clearAllVisible);

//     setKeywordClicked(true);
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);

//     let apiUrl = `http://localhost:5000/summarize`;

//     try {
//       if (selectedKeywords.length > 0) {
//         const selectedKeywordsString = selectedKeywords.join(",");
//         apiUrl += `?type=keywords&selected_keyword=${encodeURIComponent(
//           selectedKeywordsString
//         )}&sent_number=${sentNumber}`;
//       } else {
//         apiUrl += `?type=paragraph&sent_number=${sentNumber}`;
//       }

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();

//       setRightSide(data);
//       setSummary(summary);
//       // setShowSentIconSection(true);
//     } catch (error) {
//       console.error("Error generating summary:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchSummary = async () => {
//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const response = await fetch(
//           `http://localhost:5000/summarize`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const data = await response.json();
//         setLeftSide(data); 
//         setSummary(summary);
//       } catch (error) {
//         console.error("Error fetching summary:", error);
//       }
//     };

//     fetchSummary();
//   }, [file, sentNumber, summary, keywordClicked]);

//   const handleDeleteAllData = () => {
//     setFile(null);
//     setLeftSide({});
//     setRightSide({});
//     setUploadButtonVisible(true);
//     // setShowSentIconSection(false);
//     setKeywordClicked(false);
//     setSentNumber(4);
//   };

//   const handleDownload = () => {
//     if (rightSide.text) {
//       FileDownload(rightSide.text, "Summary.doc");
//     } else {
//       console.log("No data to download");
//     }
//     if (rightSide.keyword_summary) {
//       FileDownload(rightSide.keyword_summary, "Summary.doc");
//     } else {
//       console.log("No data to download");
//     }
//   };

//   const handleMouseOver = () => {
//     setIsHovered(true);
//   };

//   const handleMouseOut = () => {
//     setIsHovered(false);
//   };

//   const handleCopyIconHover = () => {
//     setIsCopyIconHovered(true);
//   };

//   const handleCopyIconLeave = () => {
//     setIsCopyIconHovered(false);
//   };

//   const handleUploadIconHover = () => {
//     setIsUploadIconHovered(true);
//   };

//   const handleUploadIconLeave = () => {
//     setIsUploadIconHovered(false);
//   };

//   const handleCopyText = () => {
//     let textToCopy = "";

//     if (rightSide.text) {
//       textToCopy += rightSide.text;
//     }

//     if (rightSide.keyword_summary) {
//       if (textToCopy) {
//         textToCopy += "\n";
//       }
//       textToCopy += rightSide.keyword_summary;
//     }

//     if (textToCopy) {
//       navigator.clipboard
//         .writeText(textToCopy)
//         .then(() => {
//           setIsCopyTooltipVisible(true);
//           setTimeout(() => {
//             setIsCopyTooltipVisible(false);
//           }, 3000);
//         })
//         .catch((error) => {
//           console.error("Error copying text:", error);
//         });
//     }
//   };

//   const handleDeleteIconHover = () => {
//     setIsDeleteTooltipVisible(true);
//   };

//   const handleDeleteIconLeave = () => {
//     setIsDeleteTooltipVisible(false);
//   };

//   const handleStatIconHover = () => {
//     setIsStatTooltipVisible(true);
//   };

//   const handleStatIconLeave = () => {
//     setIsStatTooltipVisible(false);
//   };

//   return (
//     <>
//       <div className="main">
//         <div className="main-section">
//           <div className="mode-container">
//             <div className="mode-part">
//               <label className="text">Modes:</label>

//               <select onChange={handleUserTypeChange}>
//                 <option value="paragraph">Paragraph</option>
//               </select>

//               <span className="numberbox">
//                 <input
//                   className="box-1"
//                   type="number"
//                   min="0"
//                   value={sentNumber}
//                   onChange={handleSentNumberChange}
//                 />
//               </span>

//               <button onClick={handleUpload}>SUMMARIZE</button>

//               <div onClick={handleDeleteAllData}>
//                 <span
//                   className="icon-delete"
//                   onMouseEnter={handleDeleteIconHover}
//                   onMouseLeave={handleDeleteIconLeave}
//                 >
//                   <FontAwesomeIcon icon={faTrashCan} />
//                 </span>
//               </div>
//             </div>

//             <div className="upload-section">
//               <div className="left-side">
//                 {uploadButtonVisible && (
//                   <div
//                     onClick={handleFileInputClick}
//                     className="upload-doc"
//                     onMouseEnter={handleUploadIconHover}
//                     onMouseLeave={handleUploadIconLeave}
//                   >
//                     <input
//                       type="file"
//                       accept=".pdf, .doc, .docx, .txt, .png, .jpg, .jpeg"
//                       onChange={handleFileChange}
//                       hidden
//                       ref={fileInputRef}
//                     />
//                     UPLOAD
//                     <FontAwesomeIcon icon={faCloudArrowUp} className="icon" />
//                     {isUploadIconHovered && (
//                       <div className="tooltip upload-tooltip">Upload Doc</div>
//                     )}
//                   </div>
//                 )}
//                 <div className="text-container">
//                   <p>{leftSide.text}</p> 
                
//                 </div>
//               </div>
//               <div className="right-side">
//                 <p id="right-side-text">{rightSide.text}</p>
//                 <p>{summary}</p>

//                 <div className="keyword-summary">
//                   <p id="right-side-text">{rightSide.keyword_summary}</p>
//                 </div>
//               </div>
//             </div>

//             {showStatistics && (
//               <div
//                 className={`statistics-slider ${showStatistics ? "show" : ""}`}
//               >
//                 <h2>
//                   Statistics{" "}
//                   <span
//                     className="cros-icon"
//                     onClick={() => setShowStatistics(false)}
//                   >
//                     <FontAwesomeIcon icon={faXmark} />
//                   </span>
//                 </h2>
//                 <hr />
//                 <div className="stat-text">
//                   <div className="word-sec">
//                     <h4>Word Count</h4>
//                     <p className="Lnum-word">{leftSide.Lnum_word}</p>{" "}
//                     <p className="arrow">
//                       <FontAwesomeIcon icon={faArrowRight} />
//                     </p>
//                     <p className="Rnum-word">{rightSide.Rnum_word}</p>
//                     <p className="Rnum-word">{rightSide.Bnum_word}</p>
//                     <p className="Rnum-word">{rightSide.num_word}</p>
//                   </div>
//                   <div className="sent-sec">
//                     <h4>Sentence Count</h4>
//                     <p className="Lnum-sent">{leftSide.Lnum_sent}</p>{" "}
//                     <p className="arrow">
//                       <FontAwesomeIcon icon={faArrowRight} />
//                     </p>
//                     <p className="Rnum-sent">{rightSide.Rnum_sent}</p>
//                     <p className="Rnum-sent">{rightSide.Bnum_sent}</p>
//                     <p className="Rnum-sent">{rightSide.num_sent}</p>
//                   </div>
//                   <div className="percent">
//                     <h4>Reduction</h4>
//                     <p className="per">{rightSide.statistics}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {!uploadButtonVisible && (
//               <div className="container-sum">
//                 <div className="keywords-container">
//                   <div className="keywords">
//                     <div>
//                       <div className="key-head">
//                         <h4>Select keywords :</h4>
//                         {selectedKeywords.length > 1 &&
//                           clearAllButtonVisible && (
//                             <p
//                               className="clear-all-btn"
//                               onClick={() => {
//                                 setActiveKeywords([]);
//                                 setSelectedKeywords([]);
//                               }}
//                             >
//                               Clear All
//                             </p>
//                           )}
//                       </div>
//                       <p className="btn">
//                         {leftSide.keywords &&
//                           leftSide.keywords.split(",").map((keyword, index) => (
//                             <button
//                               key={index}
//                               className={
//                                 activeKeywords.includes(keyword)
//                                   ? "selected"
//                                   : ""
//                               }
//                               onClick={() => handleKeywordClick(keyword)}
//                             >
//                               {keyword}
//                             </button>
//                           ))}
//                       </p>
//                     </div>
//                     <div className="word-sent">
//                       <p>{leftSide.Lnum_word} words</p>
//                       <p>{leftSide.Lnum_sent} sentences</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="all-icons">
//               <span
//                 className="stat-icon"
//                 onClick={handleStatIconClick}
//                 onMouseEnter={handleStatIconHover}
//                 onMouseLeave={handleStatIconLeave}
//               >
//                 <FontAwesomeIcon icon={faSquarePollVertical} />
//               </span>
//               <span
//                 className="down-icon"
//                 onClick={handleDownload}
//                 onMouseOver={handleMouseOver}
//                 onMouseOut={handleMouseOut}
//               >
//                 <FontAwesomeIcon icon={faCircleArrowDown} />
//               </span>
//               <span
//                 className="copy-icon"
//                 onClick={handleCopyText}
//                 onMouseEnter={handleCopyIconHover}
//                 onMouseLeave={handleCopyIconLeave}
//               >
//                 <FontAwesomeIcon icon={faCopy} />
//               </span>
//             </div>

//             {isHovered && <div className="tooltip export-tooltip">Export</div>}
//             {isCopyIconHovered && (
//               <div className="tooltip copied-tooltip">Copy All Text</div>
//             )}
//             {isCopyTooltipVisible && (
//               <div className="tooltip text-tooltip">Text Copied</div>
//             )}
//             {isStatTooltipVisible && (
//               <div className="tooltip stat-tooltip">Statistics</div>
//             )}
//             {isDeleteTooltipVisible && (
//               <div className="tooltip delete-tooltip">Delete All Text</div>
//             )}
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// export default Tabs;



import React, { useRef, useState, useEffect } from "react";
import './Summarizer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faTrashCan,
  faSquarePollVertical,
  faCircleArrowDown,
  faCopy,
  faXmark,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import FileDownload from "react-file-download";

function Tabs() {
  const fileInputRef = useRef(null);
  const [leftSide, setLeftSide] = useState({});
  const [rightSide, setRightSide] = useState({});
  const [sentNumber, setSentNumber] = useState(5);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const [isCopyIconHovered, setIsCopyIconHovered] = useState(false);
  const [isUploadIconHovered, setIsUploadIconHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteTooltipVisible, setIsDeleteTooltipVisible] = useState(false);
  const [isStatTooltipVisible, setIsStatTooltipVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadButtonVisible, setUploadButtonVisible] = useState(true);
  // const [showSentIconSection, setShowSentIconSection] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [clearAllButtonVisible, setClearAllButtonVisible] = useState(true);
  const [keywordClicked, setKeywordClicked] = useState(false);

  const handleStatIconClick = () => {
    setShowStatistics(!showStatistics);
  };

  const handleSentNumberChange = (e) => {
    setSentNumber(parseInt(e.target.value, 10));
  };

  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
    setUploadButtonVisible(false);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
    setIsUploadIconHovered(false);
  };

  const handleKeywordClick = (keyword) => {
    const updatedSelectedKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter((k) => k !== keyword)
      : [...selectedKeywords, keyword];

    setSelectedKeywords(updatedSelectedKeywords);
    setActiveKeywords(updatedSelectedKeywords);

    const clearAllVisible = updatedSelectedKeywords.length > 1;
    setClearAllButtonVisible(clearAllVisible);

    setKeywordClicked(true);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    let apiUrl = `http://localhost:8080/upload`;

    try {
      if (selectedKeywords.length > 0) {
        const selectedKeywordsString = selectedKeywords.join(",");
        apiUrl += `?type=keywords&selected_keyword=${encodeURIComponent(
          selectedKeywordsString
        )}&sent_number=${sentNumber}`;
      } else {
        apiUrl += `?type=paragraph&sent_number=${sentNumber}`;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setRightSide(data);
      // setShowSentIconSection(true);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `http://localhost:8080/upload?sent_number=${5}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setLeftSide(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    if (file) {
      fetchSummary();
    }
  }, [file, sentNumber, keywordClicked]);

  const handleDeleteAllData = () => {
    setFile(null);
    setLeftSide({});
    setRightSide({});
    setUploadButtonVisible(true);
    // setShowSentIconSection(false);
    setKeywordClicked(false);
    setSentNumber(4);
  };

  const handleDownload = () => {
    if (rightSide.text) {
      FileDownload(rightSide.text, "Summary.doc");
    } else {
      console.log("No data to download");
    }
    if (rightSide.keyword_summary) {
      FileDownload(rightSide.keyword_summary, "Keyword_Summary.doc");
    } else {
      console.log("No data to download");
    }
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const handleCopyIconHover = () => {
    setIsCopyIconHovered(true);
  };

  const handleCopyIconLeave = () => {
    setIsCopyIconHovered(false);
  };

  const handleUploadIconHover = () => {
    setIsUploadIconHovered(true);
  };

  const handleUploadIconLeave = () => {
    setIsUploadIconHovered(false);
  };

  const handleCopyText = () => {
    let textToCopy = "";

    if (rightSide.text) {
      textToCopy += rightSide.text;
    }

    if (rightSide.keyword_summary) {
      if (textToCopy) {
        textToCopy += "\n";
      }
      textToCopy += rightSide.keyword_summary;
    }

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setIsCopyTooltipVisible(true);
          setTimeout(() => {
            setIsCopyTooltipVisible(false);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error copying text:", error);
        });
    }
  };

  const handleDeleteIconHover = () => {
    setIsDeleteTooltipVisible(true);
  };

  const handleDeleteIconLeave = () => {
    setIsDeleteTooltipVisible(false);
  };

  const handleStatIconHover = () => {
    setIsStatTooltipVisible(true);
  };

  const handleStatIconLeave = () => {
    setIsStatTooltipVisible(false);
  };

  return (
    <>
      <div className="main">
        <div className="main-section">
          <div className="mode-container">
            <div className="mode-part">
              <label className="text">Modes:</label>

              <select>
                <option value="paragraph">Paragraph</option>
              </select>

              <span className="numberbox">
                <input
                  className="box-1"
                  type="number"
                  min="0"
                  value={sentNumber}
                  onChange={handleSentNumberChange}
                />
              </span>

              <button onClick={handleUpload}>SUMMARIZE</button>

              <div onClick={handleDeleteAllData}>
                <span
                  className="icon-delete"
                  onMouseEnter={handleDeleteIconHover}
                  onMouseLeave={handleDeleteIconLeave}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
              </div>
            </div>

            <div className="upload-section">
              <div className="left-side">
                {uploadButtonVisible && (
                  <div
                    onClick={handleFileInputClick}
                    className="upload-doc"
                    onMouseEnter={handleUploadIconHover}
                    onMouseLeave={handleUploadIconLeave}
                  >
                    <input
                      type="file"
                      accept=".pdf, .doc, .docx, .txt, .png, .jpg, .jpeg"
                      onChange={handleFileChange}
                      hidden
                      ref={fileInputRef}
                    />
                    UPLOAD
                    <FontAwesomeIcon icon={faCloudArrowUp} className="icon" />
                    {isUploadIconHovered && (
                      <div className="tooltip upload-tooltip">Upload Doc</div>
                    )}
                  </div>
                )}
                <div className="text-container">
                  <p>{leftSide.summary}</p>
                </div>
              </div>
              <div className="right-side">
                <p id="right-side-text">{rightSide.text}</p>

                <div className="keyword-summary">
                  <p id="right-side-text">{rightSide.keyword_summary}</p>
                </div>
              </div>
            </div>

            {showStatistics && (
              <div
                className={`statistics-slider ${showStatistics ? "show" : ""}`}
              >
                <h2>
                  Statistics{" "}
                  <span
                    className="cros-icon"
                    onClick={() => setShowStatistics(false)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                </h2>
                <hr />
                <div className="stat-text">
                  <div className="word-sec">
                    <h4>Word Count</h4>
                    <p className="Lnum-word">{leftSide.Lnum_word}</p>{" "}
                    <p className="arrow">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </p>
                    <p className="Rnum-word">{rightSide.Rnum_word}</p>
                    <p className="Rnum-word">{rightSide.Bnum_word}</p>
                    <p className="Rnum-word">{rightSide.num_word}</p>
                  </div>
                  <div className="sent-sec">
                    <h4>Sentence Count</h4>
                    <p className="Lnum-sent">{leftSide.Lnum_sent}</p>{" "}
                    <p className="arrow">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </p>
                    <p className="Rnum-sent">{rightSide.Rnum_sent}</p>
                    <p className="Rnum-sent">{rightSide.Bnum_sent}</p>
                    <p className="Rnum-sent">{rightSide.num_sent}</p>
                  </div>
                  <div className="percent">
                    <h4>Reduction</h4>
                    <p className="per">{rightSide.statistics}</p>
                  </div>
                </div>
              </div>
            )}

            {!uploadButtonVisible && (
              <div className="container-sum">
                <div className="keywords-container">
                  <div className="keywords">
                    <div>
                      <div className="key-head">
                        <h4>Select keywords :</h4>
                        {selectedKeywords.length > 1 &&
                          clearAllButtonVisible && (
                            <p
                              className="clear-all-btn"
                              onClick={() => {
                                setActiveKeywords([]);
                                setSelectedKeywords([]);
                              }}
                            >
                              Clear All
                            </p>
                          )}
                      </div>
                      <p className="btn">
                        {leftSide.keywords &&
                          leftSide.keywords.split(",").map((keyword, index) => (
                            <button
                              key={index}
                              className={
                                activeKeywords.includes(keyword)
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => handleKeywordClick(keyword)}
                            >
                              {keyword}
                            </button>
                          ))}
                      </p>
                    </div>
                    <div className="word-sent">
                      <p>{leftSide.Lnum_word} words</p>
                      <p>{leftSide.Lnum_sent} sentences</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="all-icons">
              <span
                className="stat-icon"
                onClick={handleStatIconClick}
                onMouseEnter={handleStatIconHover}
                onMouseLeave={handleStatIconLeave}
              >
                <FontAwesomeIcon icon={faSquarePollVertical} />
              </span>
              <span
                className="down-icon"
                onClick={handleDownload}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <FontAwesomeIcon icon={faCircleArrowDown} />
              </span>
              <span
                className="copy-icon"
                onClick={handleCopyText}
                onMouseEnter={handleCopyIconHover}
                onMouseLeave={handleCopyIconLeave}
              >
                <FontAwesomeIcon icon={faCopy} />
              </span>
            </div>

            {isHovered && <div className="tooltip export-tooltip">Export</div>}
            {isCopyIconHovered && (
              <div className="tooltip copied-tooltip">Copy All Text</div>
            )}
            {isCopyTooltipVisible && (
              <div className="tooltip text-tooltip">Text Copied</div>
            )}
            {isStatTooltipVisible && (
              <div className="tooltip stat-tooltip">Statistics</div>
            )}
            {isDeleteTooltipVisible && (
              <div className="tooltip delete-tooltip">Delete All Text</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Tabs;
