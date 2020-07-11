import React, { Component } from 'react';
import PropTypes from 'prop-types';

import countries from './countries';

class ReactFlagsSelect extends Component {
    state = {
        openOptions: false,
        filteredCountries: []
    };

    componentDidMount() {
        this.setCountries();
        !this.props.disabled && window.addEventListener('click', this.closeOptions);

        this.setState({
            defaultCountry: countries[this.props.defaultCountry] && this.props.defaultCountry
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.countries !== this.props.countries || prevProps.blackList !== this.props.blackList) {
            this.setCountries();
        }
    }

    componentWillUnmount() {
        !this.props.disabled && window.removeEventListener('click', this.closeOptions);
    }

    toggleOptions = () => {
        !this.state.disabled && this.setState({
            openOptions: !this.state.openOptions
        });
    };

    toggleOptionsWithKeyboard = (evt) => {
        evt.preventDefault();
        if (evt.keyCode === 13) {
            //enter key: toggle options
            this.toggleOptions();
        } else if (evt.keyCode === 27) {
            //esc key: hide options
            !this.state.disabled && this.setState({
                openOptions: false
            });
        }

    };

    closeOptions = (event) => {
        if (event.target !== this.refs.selectedFlag && event.target !== this.refs.flagOptions && event.target !== this.refs.filterText) {
            this.setState({
                openOptions: false
            });
        }
    };

    onSelect = (countryCode) => {
        this.setState({
            selected: countryCode,
            filter: ''
        });
        this.props.onSelect && this.props.onSelect(countryCode);
    };

    onSelectWithKeyboard = (evt, countryCode) => {
        evt.preventDefault();
        if (evt.keyCode === 13) {
            //enter key: select
            this.onSelect(countryCode);
            this.closeOptions(evt);
        } else if (evt.keyCode === 27) {
            //esc key: hide options
            this.toggleOptions();
        }
    };

    updateSelected = (countryCode) => {
        let isValid = countries[countryCode];

        isValid && this.setState({
            selected: countryCode
        });
    };

    filterSearch = (evt) => {
        let filterValue = evt.target.value;
        let filteredCountries = filterValue && this.state.countries.filter(key => {
            let label = this.props.customLabels[key] || countries[key];
            return label && label.match(new RegExp(filterValue, 'i'));
        });

        this.setState({ filter: filterValue, filteredCountries: filteredCountries });
    };

    setCountries = () => {
        const fullCountries = Object.keys(countries);

        let selectCountries = this.props.countries && this.props.countries.filter(country => {
            return countries[country];
        });

        //Filter BlackList
        if (this.props.blackList && selectCountries) {
            selectCountries = fullCountries.filter(countryKey => {
                return selectCountries.filter(country => {
                    return countryKey === country;
                }).length === 0;
            });
        }

        this.setState({
            countries: selectCountries || fullCountries
        }, () => {
            const { selected } = this.state;

            if (selected && !this.state.countries.includes(selected)) {
                this.setState({ selected: null });
            }
        });
    };

    render() {
        const { renderFlagImage } = this.props;
        let isSelected = this.state.selected || this.state.defaultCountry;
        let selectedSize = this.props.selectedSize;
        let optionsSize = this.props.optionsSize;
        let alignClass = this.props.alignOptions.toLowerCase() === 'left' ? 'to--left' : '';
        let countriesToShow = (this.state.filter ? this.state.filteredCountries : this.state.countries);

        if (isSelected) {
            countriesToShow = countriesToShow.filter(countryCode => countryCode !== isSelected);
        }

        return (<div className={`flag-select ${this.props.className ? this.props.className : ''}`}>
            <div
                ref="selectedFlag"
                style={{ fontSize: `${selectedSize}px` }}
                onClick={this.toggleOptions}
                onKeyUp={this.toggleOptionsWithKeyboard}
                tabIndex="0"
                className={`selected--flag--option ${this.props.disabled ? 'no--focus' : ''}`}
            >
                {
                    isSelected && <div
                        style={{ width: `${selectedSize}px`, height: `${selectedSize}px` }}
                        className="country-flag"
                    >
                        {
                            renderFlagImage ? (
                                renderFlagImage(require(`../flags/${isSelected.toLowerCase()}.svg`).default, isSelected)
                            ) : (
                                <img
                                    alt={isSelected}
                                    src={require(`../flags/${isSelected.toLowerCase()}.svg`).default}
                                />
                            )
                        }
                    </div>
                }
            </div>
            {
                this.state.openOptions && <div
                    ref="flagOptions"
                    style={{ fontSize: `${optionsSize}px` }}
                    className={`flag-options ${alignClass}`}
                >
                    {
                        this.props.searchable && <div className="filterBox">
                            <input
                                ref="filterText"
                                type="text"
                                onChange={this.filterSearch}
                                placeholder={this.props.searchPlaceholder}
                            />
                        </div>
                    }
                    {
                        countriesToShow.map(countryCode =>
                            <div
                                key={countryCode}
                                onClick={() => this.onSelect(countryCode)}
                                onKeyUp={evt => this.onSelectWithKeyboard(evt, countryCode)}
                                tabIndex="0"
                                className={`flag-option ${this.props.showOptionLabel ? 'has-label' : ''}`}
                            >
								<span
                                    className="country-flag"
                                    style={{ width: `${optionsSize}px`, height: `${optionsSize}px` }}
                                >
                                    {
                                        renderFlagImage ? (
                                            renderFlagImage(require(`../flags/${countryCode.toLowerCase()}.svg`).default)
                                        ) : (
                                            <img
                                                alt={isSelected}
                                                src={require(`../flags/${countryCode.toLowerCase()}.svg`).default}
                                            />
                                        )
                                    }
                                    {
                                        this.props.showOptionLabel && <span className="country-label">
											{
                                                this.props.customLabels[countryCode] || countries[countryCode]
                                            }
										</span>
                                    }
								</span>
                            </div>
                        )
                    }
                </div>
            }
        </div>);
    }
}

ReactFlagsSelect.defaultProps = {
    selectedSize: 16,
    optionsSize: 14,
    placeholder: 'Select a country',
    showArrow: true,
    showSelectedLabel: true,
    showOptionLabel: true,
    alignOptions: 'right',
    customLabels: {},
    disabled: false,
    blackList: false,
    searchable: false,
    searchPlaceholder: 'Search',
};

ReactFlagsSelect.propTypes = {
    countries: PropTypes.array,
    blackList: PropTypes.bool,
    showArrow: PropTypes.bool,
    customLabels: PropTypes.object,
    selectedSize: PropTypes.number,
    optionsSize: PropTypes.number,
    defaultCountry: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    showSelectedLabel: PropTypes.bool,
    showOptionLabel: PropTypes.bool,
    alignOptions: PropTypes.string,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    searchable: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
};

export default ReactFlagsSelect;
