import "../App.css";

function AvocadoMascot() {
  return (
    <div className="avo-wrap">
      <svg className="avo-svg" viewBox="0 0 220 260">
        <ellipse cx="110" cy="245" rx="55" ry="10" fill="#cbd5a7" />

        //make it avocado shaped
        <path
          d="M110 10
                C80 10 50 40 40 90  
                C30 140 0 200 70 230
                C90 245 130 245 150 230
                C220 200 190 140 180 90
                C170 40 140 10 110 10Z"
          fill="#2f5d24"
        /> 
        
        //make it avocado flesh colored
        <path
          d="M110 20
                C85 20 55 45 50 90
                C45 140 20 190 80 210
                C95 220 125 220 140 210
                C200 190 175 140 170 90
                C165 45 135 20 110 20Z"
          fill="#8cc63f"
        />

        //make it avocado pit colored
        <path
          d="M110 60
                C95 60 80 75 78 98
                C75 120 80 140 90 150
                C100 160 110 165 120 160
                C130 155 135 140 132 120
                C130 100 120 85 110 60Z"
          fill="#eef7a1"
        />

        

        <circle cx="83" cy="105" r="12" fill="#3b2417" />
        <circle cx="137" cy="105" r="12" fill="#3b2417" />
        <circle cx="87" cy="101" r="4" fill="white" />
        <circle cx="141" cy="101" r="4" fill="white" />

        <ellipse cx="70" cy="128" rx="11" ry="7" fill="#ff9b76" />
        <ellipse cx="150" cy="128" rx="11" ry="7" fill="#ff9b76" />

        <path
          d="M98 120 Q110 134 122 120"
          stroke="#3b2417"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        <circle cx="110" cy="168" r="32" fill="#4b2a19" />
        <circle cx="110" cy="168" r="25" fill="#b8753d" />
        <ellipse
          cx="98"
          cy="150"
          rx="7"
          ry="12"
          fill="white"
          opacity="0.65"
          transform="rotate(40 98 150)"
        />

        <g className="avo-wave-hand">
          <path
            d="M58 145 C35 138 27 115 42 103"
            stroke="#3b2417"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx="41"
            cy="101"
            rx="10"
            ry="13"
            fill="#3b2417"
            transform="rotate(-25 41 101)"
          />
        </g>

        <path
          d="M162 145 C184 152 190 175 174 182"
          stroke="#3b2417"
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />

        <path
          className="avo-leg-left"
          d="M88 230 L84 250"
          stroke="#3b2417"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          className="avo-leg-right"
          d="M132 230 L136 250"
          stroke="#3b2417"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default AvocadoMascot;