'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flags = require('./flags');

var _flags2 = _interopRequireDefault(_flags);

var _countries = require('./countries');

var _countries2 = _interopRequireDefault(_countries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactFlagsSelect = function (_Component) {
	_inherits(ReactFlagsSelect, _Component);

	function ReactFlagsSelect(props) {
		_classCallCheck(this, ReactFlagsSelect);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.toggleOptions = function () {
			!_this.state.disabled && _this.setState({
				openOptions: !_this.state.openOptions
			});
		};

		_this.toggleOptionsWithKeyboard = function (evt) {
			evt.preventDefault();
			if (evt.keyCode === 13) {
				//enter key: toggle options
				_this.toggleOptions();
			} else if (evt.keyCode === 27) {
				//esc key: hide options
				!_this.state.disabled && _this.setState({
					openOptions: false
				});
			}
		};

		_this.closeOptions = function (event) {
			if (event.target !== _this.refs.selectedFlag && event.target !== _this.refs.flagOptions && event.target !== _this.refs.filterText) {
				_this.setState({
					openOptions: false
				});
			}
		};

		_this.onSelect = function (countryCode) {
			_this.setState({
				selected: countryCode,
				filter: ''
			});
			_this.props.onSelect && _this.props.onSelect(countryCode);
		};

		_this.onSelectWithKeyboard = function (evt, countryCode) {
			evt.preventDefault();
			if (evt.keyCode === 13) {
				//enter key: select
				_this.onSelect(countryCode);
				_this.closeOptions(evt);
			} else if (evt.keyCode === 27) {
				//esc key: hide options
				_this.toggleOptions();
			}
		};

		_this.updateSelected = function (countryCode) {
			var isValid = _countries2.default[countryCode];

			isValid && _this.setState({
				selected: countryCode
			});
		};

		_this.filterSearch = function (evt) {
			var filterValue = evt.target.value;
			var filteredCountries = filterValue && _this.state.countries.filter(function (key) {
				var label = _this.props.customLabels[key] || _countries2.default[key];
				return label && label.match(new RegExp(filterValue, 'i'));
			});

			_this.setState({ filter: filterValue, filteredCountries: filteredCountries });
		};

		_this.setCountries = function () {
			var fullCountries = Object.keys(_countries2.default);

			var selectCountries = _this.props.countries && _this.props.countries.filter(function (country) {
				return _countries2.default[country];
			});

			//Filter BlackList
			if (_this.props.blackList && selectCountries) {
				selectCountries = fullCountries.filter(function (countryKey) {
					return selectCountries.filter(function (country) {
						return countryKey === country;
					}).length === 0;
				});
			}

			_this.setState({
				countries: selectCountries || fullCountries
			}, function () {
				var selected = _this.state.selected;


				if (selected && !_this.state.countries.includes(selected)) {
					_this.setState({ selected: null });
				}
			});
		};

		var defaultCountry = _countries2.default[_this.props.defaultCountry] && _this.props.defaultCountry;

		_this.state = {
			defaultCountry: defaultCountry,
			openOptions: false,
			filteredCountries: []
		};
		return _this;
	}

	ReactFlagsSelect.prototype.componentDidMount = function componentDidMount() {
		this.setCountries();
		!this.props.disabled && window.addEventListener('click', this.closeOptions);
	};

	ReactFlagsSelect.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		if (prevProps.countries !== this.props.countries || prevProps.blackList !== this.props.blackList) {
			this.setCountries();
		}
	};

	ReactFlagsSelect.prototype.componentWillUnmount = function componentWillUnmount() {
		!this.props.disabled && window.removeEventListener('click', this.closeOptions);
	};

	ReactFlagsSelect.prototype.render = function render() {
		var _this2 = this;

		var isSelected = this.state.selected || this.state.defaultCountry;
		var selectedSize = this.props.selectedSize;
		var optionsSize = this.props.optionsSize;
		var alignClass = this.props.alignOptions.toLowerCase() === 'left' ? 'to--left' : '';

		return _react2.default.createElement(
			'div',
			{ className: 'flag-select ' + (this.props.className ? this.props.className : '') },
			_react2.default.createElement(
				'div',
				{
					ref: 'selectedFlag',
					style: { fontSize: selectedSize + 'px' },
					onClick: this.toggleOptions,
					onKeyUp: this.toggleOptionsWithKeyboard,
					tabIndex: '0',
					className: 'selected--flag--option ' + (this.props.disabled ? 'no--focus' : '')
				},
				isSelected && _react2.default.createElement(
					'span',
					{
						style: { width: selectedSize + 'px', height: selectedSize + 'px' },
						className: 'country-flag'
					},
					_react2.default.createElement('img', {
						alt: isSelected,
						src: _flags2.default[isSelected]
					}),
					this.props.showSelectedLabel && _react2.default.createElement(
						'span',
						{ className: 'country-label' },
						this.props.customLabels[isSelected] || _countries2.default[isSelected]
					)
				),
				!isSelected && _react2.default.createElement(
					'span',
					{ className: 'country-label' },
					this.props.placeholder
				),
				_react2.default.createElement(
					'span',
					{ className: 'arrow-down ' + (this.props.disabled ? 'hidden' : '') },
					'\u25BE'
				)
			),
			this.state.openOptions && _react2.default.createElement(
				'div',
				{
					ref: 'flagOptions',
					style: { fontSize: optionsSize + 'px' },
					className: 'flag-options ' + alignClass
				},
				this.props.searchable && _react2.default.createElement(
					'div',
					{ className: 'filterBox' },
					_react2.default.createElement('input', {
						ref: 'filterText',
						type: 'text',
						onChange: this.filterSearch,
						placeholder: this.props.searchPlaceholder
					})
				),
				(this.state.filter ? this.state.filteredCountries : this.state.countries).map(function (countryCode) {
					return _react2.default.createElement(
						'div',
						{
							key: countryCode,
							onClick: function onClick() {
								return _this2.onSelect(countryCode);
							},
							onKeyUp: function onKeyUp(evt) {
								return _this2.onSelectWithKeyboard(evt, countryCode);
							},
							tabIndex: '0',
							className: 'flag-option ' + (_this2.props.showOptionLabel ? 'has-label' : '')
						},
						_react2.default.createElement(
							'span',
							{
								className: 'country-flag',
								style: { width: optionsSize + 'px', height: optionsSize + 'px' }
							},
							_react2.default.createElement('img', { src: _flags2.default[countryCode] }),
							_this2.props.showOptionLabel && _react2.default.createElement(
								'span',
								{ className: 'country-label' },
								_this2.props.customLabels[countryCode] || _countries2.default[countryCode]
							)
						)
					);
				})
			)
		);
	};

	return ReactFlagsSelect;
}(_react.Component);

ReactFlagsSelect.defaultProps = {
	selectedSize: 16,
	optionsSize: 14,
	placeholder: 'Select a country',
	showSelectedLabel: true,
	showOptionLabel: true,
	alignOptions: 'right',
	customLabels: {},
	disabled: false,
	blackList: false,
	searchable: false,
	searchPlaceholder: 'Search'
};

ReactFlagsSelect.propTypes = process.env.NODE_ENV !== "production" ? {
	countries: _propTypes2.default.array,
	blackList: _propTypes2.default.bool,
	customLabels: _propTypes2.default.object,
	selectedSize: _propTypes2.default.number,
	optionsSize: _propTypes2.default.number,
	defaultCountry: _propTypes2.default.string,
	placeholder: _propTypes2.default.string,
	className: _propTypes2.default.string,
	showSelectedLabel: _propTypes2.default.bool,
	showOptionLabel: _propTypes2.default.bool,
	alignOptions: _propTypes2.default.string,
	onSelect: _propTypes2.default.func,
	disabled: _propTypes2.default.bool,
	searchable: _propTypes2.default.bool,
	searchPlaceholder: _propTypes2.default.string
} : {};

exports.default = ReactFlagsSelect;
module.exports = exports['default'];