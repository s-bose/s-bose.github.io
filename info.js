let info = {
  name: "Shiladitya Bose",
  logo_name: "bose",
  flat_picture: require("./src/assets/portrait.jpg"),
  config: {
    use_cookies: true,
    navbar: {
      blur: false
    }
  },
  description:
    "Hi, I am a software developer from Kolkata, \
    India. I graduated from the University of Calcutta \
    with a Masters in Computer Science and Engineering. \
    My areas of interest include Software Development, \
    DevOps, Data Science and Artificial Intelligence, \
    for which I am currently seeking exciting and challenging \
    opportunities.<br><br>\
    I am passionate about computer science and software engineering, \
    and I consistently engage myself in learning and developing new \
    skillsets and ideas. Throughout the years I have gained experience \
    in a wide range of technologies in areas such as backend and \
    full-stack development, machine learning, and computer vision. \
    I believe that my skills have and will continue to shape \
    me, and I look forward to implementing and improving them in every \
    opportunity that I receive.",

  links: {
    linkedin: "https://www.linkedin.com/in/shiladitya-bose/",
    github: "https://github.com/s-bose",
    resume:
      "https://github.com/s-bose/s-bose.github.io/blob/master/src/assets/pdfs/Resume.pdf"
  },
  education: [
    {
      name: "University of Calcutta",
      place: "India",
      date: "June, 2018 - July, 2021",
      degree: "Masters in Computer Science & Application (MCA)",
      gpa: "3.7/4.0",
      description:
        "Finished my Masters from University of Calcutta. I specialized in Deep Learning & Computer Vision and researched on various SOTA architectures on 2D and 3D medical image analysis, especially on brain tumors.",
      skills: [
        "Computer Vision",
        "Neural Networks",
        "Machine Learning",
        "Software Engineering",
        "Data Structures & Algorithms",
        "Artificial Intelligence",
        "OS"
      ]
    },
    {
      name: "University of Calcutta",
      place: "India",
      date: "June, 2014 - June, 2018",
      degree: "Bachelors in Computer Science (B.Sc)",
      gpa: "8.0/10.0",
      description:
        "",
      skills: [
        "Software Engineering",
        "Algorithms",
        "Web Development",
      ]
    }
  ],
  experience: [
    {
      name: "Tata Consultancy Services Ltd.",
      place: "Kolkata, India",
      date: "Aug, 2021 - Present",
      position: "Systems Engineer",
      description:
        "Currently working as a software engineer. I have built several automation pipelines for system administration and statistical reports on server health. Additionally, I created an interactive access management portal for a CMS application backend.",
      skills: ["Python", "Flask", "Pandas", "Numpy", "Selenium", "Javascript"]
    },
    {
      name: "SleekSky LLC",
      place: "San Jose, USA (Remote)",
      date: "Jan, 2021 - Apr, 2021",
      position: "Python Backend Engineer",
      description:
        "Worked as an intern in backend development. Developed the backend infrastructure of a headless CMS in FastAPI, Docker, PostgreSQL and others. In addition, worked on various feature improvements and hosting/testing on various cloud platforms.",
      skills: ["FastAPI", "PostgreSQL", "Docker", "NGINX", "AWS", "REST API"]
    },
  ],
  skills: [
    {
      title: "languages",
      info: [
        "Python",
        "C++",
        "C",
        "Javascript",
        "SQL",
      ],
      icon: "fa fa-code"
    },
    {
      title: "libraries & frameworks",
      info: [
        "FastAPI",
        "Flask",
        "Numpy",
        "Pandas",
        "Scikit-Learn",
        "SciPy",
        "Tensorflow",
        "PyTorch",
        "Selenium",
      ],
      icon: "fa fa-cubes"
    },
    {
      title: "web technologies",
      info: ["VueJS", "Flask", "HTML", "CSS"],
      icon: "fas fa-laptop-code"
    },
    {
      title: "databases",
      info: ["MongoDB", "PostgreSQL", "Redis"],
      icon: "fa fa-database"
    },
    {
      title: "operating systems & tools",
      info: [
        "Linux",
        "Windows",
        "Agile",
        "Scrum",
        "DevOps"
      ],
      icon: "fas fa-tools"
    },
  ],
  portfolio: [
    {
      name: "OPWM",
      pictures: [
        {
          img: require("./src/assets/portfolio/opwm/swaggerui.png")
        },
        {
          img: require("./src/assets/portfolio/opwm/main.gif")
        }
      ],
      technologies: ["FastAPI", "VueJS", "PostgreSQL", "Docker", "Python"],
      category: "Application",
      date: "Jun, 2021 - Sep, 2021",
      github:
        "https://github.com/s-bose/opwm",
      description:
        "OPWM (Offline Password Manager) is a completely offline password vault with a user-friendly frontend for storing / retrieving username-password credentials for different websites. It is built using FastAPI as a backend with a PostgreSQL database, and the frontend written in VueJS. The entire stack is running on a localized Docker container."
    },
    {
      name: "Wallpappr",
      pictures: [
        {
          img: require("./src/assets/portfolio/wallpappr/one.png")
        },
        {
          img: require("./src/assets/portfolio/wallpappr/two.png")
        },
      ],
      technologies: ["VueJS", "Axios", "ElectronJS"],
      category: "Application",
      date: "Apr, 2021 - May , 2021",
      github: "https://github.com/s-bose/wallpappr",
      visit: "https://snapcraft.io/wallpappr",
      description:
        "Wallpappr is a desktop wallpaper application created using VueJS and ElectronJS by collecting community-made wallpapers from Reddit's `r/wallpapers`."
    },
    {
      name: "Walks into a Bar - Dataset",
      pictures: [
        {
          img: require("./src/assets/portfolio/barjokes/thumb.png")
        },
      ],
      technologies: [
        "BeautifulSoup",
        "Selenium",
        "Pandas",
        "Numpy",
      ],
      category: "Dataset",
      github: "https://github.com/s-bose/Walks-into-a-bar-dataset",
      visit: "https://www.kaggle.com/datasets/shiladityabasu/walks-into-a-bar-dataset",
      date: "Jun, 2022",
      description:
        "Walks-into-a-bar is a dataset containing 1400+ jokes relating to bar, and different entities walking into bar. The jokes have been scraped from various sources using webscraping libraries such as BeautifulSoup, Requests and Selenium."
    },
    {
      name: "Brain Tumour Segmentation",
      pictures: [
        {
          img: require("./src/assets/portfolio/brats/pred.png")
        },
        {
          img: require("./src/assets/portfolio/brats/accuracy.png")
        }
      ],
      technologies: ["Tensorflow", "Keras", "Numpy", "SciPy", "Matplotlib"],
      category: "Project",
      date: "May, 2021 - Aug, 2021",
      github: "https://github.com/s-bose/brats_unet",
      description:
        "This is the project I worked on as part of my final year thesis for my Masters. I implemented an image segmentation model using SOTA neural network architectures such as U-Net, V-Net, and transfer learning, using Tensorflow / Keras on the BraTS (brain Tumor Segmentation Challenge) 2020 Dataset. I achieved approximately 70% accuracy in Dice metric on the validation dataset."
    },
    {
      name: "kepler Exoplanet Classification",
      pictures: [
        {
          img: require("./src/assets/portfolio/exa/thumb.jpg")
        },
        {
          img: require("./src/assets/portfolio/exa/accuracy.png")
        }
      ],
      technologies: ["Pytorch", "Python", "Numpy", "Pandas"],
      category: "Project",
      date: "May, 2017 - Aug, 2017",
      visit: "https://www.kaggle.com/code/shiladityabasu/openexa/notebook",
      description:
        "As an introduction to deep learning using Pytorch, I built a feedforward neural network to categorize deep-sky objects into planets / non-planets using the Kepler Exoplanet Catalogue."
    }
  ],
  
  recommendations: [
    {
      title:
      "I found him exemplary in his work. He worked on a CMS project, developed APIs using FastAPI framework and worked on UI using React JS framework. Shiladitya has a number of strengths; he is detail oriented, good at communication, and dependable. He is also a quick learner.",
      author: "Yusuf Bhabhrawala",
      position: "Director",
      company: "SleekSky, LLC.",
      location: "San Jose, USA"
    },
    {
      title:
        "He is a dedicated resource and a good team player. He has implemented Health check report through automated scripts, that benefits (our clients) to understand the status of all applications.",
      author: "Milind Kamble",
      position: "Delivery & Operations Head",
      company: "Tata Consultancy Services Ltd.",
      location: "India"
    },
  ]
};

export default info;
