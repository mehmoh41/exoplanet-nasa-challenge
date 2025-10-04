# **App Name**: ExoAI Explorer

## Core Features:

- Exoplanet Data Fetching: Fetch exoplanet data from the NASA Exoplanet Archive API (https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,disc_method,pl_orbper,pl_rade,pl_masse,st_teff,st_rad,st_mass+from+pscomppars&format=json).
- Interactive Exoplanet Table: Display exoplanet data in an interactive, sortable, and filterable table format, allowing users to explore various parameters.
- Exoplanet Chart Visualization: Generate interactive charts and plots (e.g., scatter plots of mass vs. radius) to visualize relationships within the exoplanet data.
- AI-Powered Data Interpretation Tool: Enable users to upload exoplanet data (CSV or JSON) for AI-powered analysis and detection simulations using a Large Language Model (LLM) tool to incorporate findings.
- Planet Comparison: Allow users to select and compare individual exoplanets based on key characteristics such as size, mass, and distance from their star.
- Explore Page: Fun facts and explanations on specific planets or groups of planets

## Style Guidelines:

- Primary color: Dark indigo (#4B0082) to evoke the vastness and mystery of space.
- Background color: Very dark grayish-blue (#232634), desaturated, complementing the dark indigo and providing contrast.
- Accent color: Electric purple (#BF00FF) to highlight interactive elements and call attention to important data.
- Font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look suitable for body text.
- Font: 'Space Grotesk' for titles.
- Use space-themed icons for categories and interactive elements.
- Implement a responsive grid layout with clear sections for data tables, charts, and analysis tools.
- Incorporate subtle animations when loading data and displaying analysis results to improve user engagement.