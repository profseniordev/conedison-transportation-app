export const requestorLetter = (email, name, jobId, locations) => {
    return `mailto:${email
    }?subject=Regarding%20Job%20${jobId
    }&body=Hello%20${encodeURI(
      name
    )}%2C%0D%0A%0D%0ARegarding%20Job%20${jobId
    }%2C%20at%20${encodeURIComponent(
      locations.map((location, index) => (
        location.address
      )).join(', ')
    )}`;
}