'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

type LanguageDataType = {
  langCode: Locale
  langName: string
}

const getLocalePath = (pathName: string, locale: string) => {
  if (!pathName) return '/'
  const segments = pathName.split('/')

  segments[1] = locale

  return segments.join('/')
}

// Default language names as fallback
const defaultLanguageNames = {
  pt: "Portuguese",
  en: "English",
  fr: "French",
  ar: "Arabic"
}

const LanguageDropdown = ({ lang }: { lang: Locale }) => {
  // States
  const [open, setOpen] = useState(false)
  const [languageData, setLanguageData] = useState<LanguageDataType[]>([
    { langCode: "pt", langName: defaultLanguageNames.pt },
    { langCode: "en", langName: defaultLanguageNames.en },
    { langCode: "fr", langName: defaultLanguageNames.fr },
    { langCode: "ar", langName: defaultLanguageNames.ar }
  ])

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const pathName = usePathname()
  const { settings } = useSettings()

  // Fetch dictionary data when component mounts
  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        // Dynamically import the dictionary
        const dictionary = await import(`@/data/dictionaries/${lang}.json`).then(module => module.default)
        
        if (dictionary.languages) {
          setLanguageData([
            { langCode: "pt", langName: dictionary.languages.portuguese || defaultLanguageNames.pt },
            { langCode: "en", langName: dictionary.languages.english || defaultLanguageNames.en },
            { langCode: "fr", langName: dictionary.languages.french || defaultLanguageNames.fr },
            { langCode: "ar", langName: dictionary.languages.arabic || defaultLanguageNames.ar }
          ])
        }
      } catch (error) {
        console.error("Error loading language dictionary:", error)
      }
    }

    fetchDictionary()
  }, [lang])

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='!text-textPrimary'>
        <i className='ri-translate-2' />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  {languageData.map(locale => (
                    <MenuItem
                      key={locale.langCode}
                      component={Link}
                      href={getLocalePath(pathName, locale.langCode)}
                      onClick={handleClose}
                      selected={lang === locale.langCode}
                    >
                      {locale.langName}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default LanguageDropdown
