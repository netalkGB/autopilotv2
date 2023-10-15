((document) => {
  const forms = document.querySelectorAll('form')
  const submitButtons = document.querySelectorAll('input[type=\'submit\']')
  forms.forEach(form => form.addEventListener('submit', () => {
    if (submitButtons) {
      submitButtons.forEach(v => { v.disabled = true })
    }
  }))
})(document)
